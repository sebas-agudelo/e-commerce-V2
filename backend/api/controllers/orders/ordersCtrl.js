import { supabase_config } from "../../supabase_config/supabase_conlig.js";
import validator from "validator";
import { userDataValidations } from "../../validate/signValidation.js";

const supabase = supabase_config();

export const validateCheckoutUserData = async (req, res) => {
  const { email, firstname, lastname, birthday, phone, address, postal } =
    req.body;

  const validationError = userDataValidations(
    email,
    firstname,
    lastname,
    birthday,
    phone,
    address,
    postal
  );

  if (validationError) {
    return res.status(400).json(validationError);
  }

  return res.status(200).json({ success: "true" });
};

//Hämtar inloggade användarens order för att visa i Mina beställningar
export const getUserOrderSummaries = async (req, res) => {
  const userId = req?.user?.id || null;

  if (!userId) {
    return res
      .status(401)
      .json({ error: "Din session har gått ut. Logga in för att fortsätta." });
  }

  try {
    const { data: orders, ordersError } = await supabase
      .from("orders")
      .select(
        `
      id,
      total_amount,
      created_at,
      payment_status,
      email
        `
      )
      .eq("user_id", userId);

    if (ordersError) {
      throw new Error(
        `Internt fel: Kunde inte hämta hela ordern för inloggad användare. (showCostumersOrders: ordersError): ${JSON.stringify(
          ordersError
        )}`
      );
    }

    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: "Något gick fel. Försök igen." });
  }
};

export const getUserOrderDetails = async (req, res) => {
const userId = req?.user?.id || null;
  const { order_id } = req.params;
  
  if (!userId) {
    return res
      .status(401)
      .json({ error: "Din session har gått ut. Logga in för att fortsätta." });
  }

  try {
      let { data: orders, ordersError } = await supabase
      .from("orders")
      .select(
        `
      id,
      total_amount,
      created_at,
      payment_status,
      email,
      items_order (
        order_id,
        product_id,
        quantity,
        unit_price,
        sale_unit_price,
        product_title
        )
        `
      )
      .eq("id", order_id)
      .eq("user_id", userId);

    if (ordersError) {
      throw new Error(
        `Internt fel: Kunde inte hämta hela ordern för inloggad användare. (showCostumersOrders: ordersError): ${JSON.stringify(
          ordersError
        )}`
      );
    }

    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res.status(200).json([]);
    }

    let processedOrders  = []
    let totalDiscountSum = 0;
    for(const order of orders){
      for(const item of order.items_order){
        const discount = item.unit_price - item.sale_unit_price || 0;
        totalDiscountSum = discount * item.quantity || 0; 
      }

      processedOrders .push({...order, totalDiscountSum})
    }


    let characters = "0123456789";
  let orderNumber = "";
  for (let i = 0; i < 10; i++) {
orderNumber += characters[Math.floor(Math.random() * characters.length)];
  
  }


  console.log(parseInt(orderNumber));
  
    

    return res.status(200).json(processedOrders );
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: "Något gick fel. Försök igen." });
  }
};

//Bearbeartar inloggade användarens order
export const customerAuthOrders = async (req, res) => {
  const { ItemsToSend, email } = req.body;

  const userId = req?.user?.id || null;
  
  console.log(ItemsToSend);
  

  if (!userId) {
    return res
      .status(401)
      .json({ error: "Din session har gått ut. Logga in för att fortsätta." });
  }

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({
      error: "Ogiltig eller saknad e-postadress.",
    });
  }

  try {
    const { data: shopping_cart, shoppingCartError } = await supabase
      .from("shopping_cart")
      .select("id, user_id, total_price")
      .eq("user_id", userId);

    if (shoppingCartError) {
      throw new Error(
        `Internt fel: Kunde hämta varukorgen i samband med skapande av order för inloggad användare. (customerAuthOrders: shoppingCartError): ${JSON.stringify(
          shoppingCartError
        )}`
      );
    }

    if (!Array.isArray(shopping_cart) || shopping_cart.length === 0) {
      return res.status(400).json({
        error:
          "Din varukorg är tom. Vi kan tyvärr inte behandla din beställning utan produkter. Vänligen lägg till minst en vara och försök igen.",
      });
    }

    let totalAmount = 0;
    shopping_cart.forEach((item) => {
      totalAmount += item.total_price;
    });

    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          email: email,
          total_amount: totalAmount,
          payment_status: "betald",
          guest_id: null,
        },
      ])
      .select();

    if (ordersError) {
      throw new Error(
        `Internt fel: Kunde inte skapa order för inloggad användare. 'ordersError' (customerAuthOrders: ordersError): ${JSON.stringify(
          ordersError
        )}`
      );
    }

    if (!orders || !Array.isArray(orders) || !orders[0].id) {
      return res.status(422).json({
        error: "Din order kunde inte registreras korrekt. Försök igen.",
      });
    }

    const orderID = orders[0].id;

    const theItems = ItemsToSend.map((item) => ({
      order_id: orderID,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_amount: item.total_price,
      product_title: item.product_title,
      sale_unit_price: item.sale_unit_price
    }));

    const { data: items_order, error: items_orders_Error } = await supabase
      .from("items_order")
      .insert(theItems)
      .select();

    if (items_orders_Error) {
      throw new Error(
        `Internt fel: Kunde inte skapa produkterna för ordern för inloggad användare. (customerAuthOrders: items_orders_Error): ${JSON.stringify(
          items_orders_Error
        )}`
      );
    }

    return res.status(201).json({
      success: "Tack för din betalning! Din order är nu registrerad.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Något gick fel. Försök igen." });
  }
};

//Bearbetar utloggade användarens order
export const customerOrders = async (req, res) => {
  const { guestDataObject, ItemsToSend } = req.body;
  const { email, firstname, lastname, birthday, phone, address, postal_code } =
    guestDataObject;

  const userId = req?.user?.id || null;

  const validationError = userDataValidations(
    email,
    firstname,
    lastname,
    birthday,
    phone,
    address,
    postal_code
  );
  if (validationError) {
    return res.status(400).json(validationError);
  }

  try {
    const { data: guestData, error: guestDataError } = await supabase
      .from("guest")
      .insert([
        {
          email: email,
          firstname: firstname,
          lastname: lastname,
          person_number: birthday,
          phone: phone,
          address: address,
          postal_code: postal_code,
        },
      ])
      .select();

    if (guestDataError) {
      throw new Error(
        `Internt fel: Kunde inte skapa gäst data för utloggad användare. (customerOrders: guestDataError): ${JSON.stringify(
          guestDataError
        )}`
      );
    }

    if (!guestData || !Array.isArray(guestData) || !guestData[0].id) {
      return res.status(422).json({
        error:
          "Dina personuppgifter kunde inte registreras korrekt. Försök igen.",
      });
    }

    const guestID = guestData[0].id;

    let totalAmount = 0;
    ItemsToSend.forEach((item) => {
      totalAmount += item.total_price;
    });

    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          email: email,
          total_amount: totalAmount,
          payment_status: "paid",
          guest_id: guestID,
        },
      ])
      .select();

    if (ordersError) {
      throw new Error(
        `Internt fel: Kunde inte skapa order för utloggad användare. (customerOrders: ordersError): ${JSON.stringify(
          ordersError
        )}`
      );
    }

    if (!orders || !Array.isArray(orders) || !orders[0].id) {
      return res.status(422).json({
        error: "Din order kunde inte registreras korrekt. Försök igen.",
      });
    }

    const orderID = orders[0].id;

    const theItems = ItemsToSend.map((item) => ({
      order_id: orderID,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_amount: item.total_price,
      product_title: item.product_title,
    }));

    const { data: items_order, error: items_orders_Error } = await supabase
      .from("items_order")
      .insert(theItems)
      .select();

    if (items_orders_Error) {
      throw new Error(
        `Internt fel:  Kunde inte skapa produkterna för ordern för utloggad användare. (customerOrders: items_orders_Error): ${JSON.stringify(
          items_orders_Error
        )}`
      );
    }

    return res.status(201).json({
      success: "Tack för din betalning! Din order är nu registrerad.",
    });
  } catch (error) {
    // console.error(error);
    console.error(error);

    return res.status(500).json({ error: "Något gick fel. Försök igen." });
  }
};
