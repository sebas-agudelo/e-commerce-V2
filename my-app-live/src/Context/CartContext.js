import { createContext, useContext, useEffect, useState } from "react";
import { AuthSessionContext } from "./SessionProvider";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [cartMessages, setCartMessages] = useState("");
  const [total, setTotal] = useState();
  const [saleTotalPrice, setSaleTotalPrice] = useState()
  const { session } = useContext(AuthSessionContext);

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  useEffect(() => {
    checkLocalStorage();
  }, [session]);

  useEffect(() => {
  if (session === undefined) return; // espera a que la sesión se confirme

  const loadCart = async () => {
    await showCart();
  };

  loadCart();
}, [session]);


  //Hämtar hela varukorgen för utloggade och inloggade användare
  const showCart = async () => {
    const storedCart = localStorage.getItem("cart");
    const cartData = JSON.parse(storedCart);

    if (session === false) {
      if (cartData) {
        setCartItems(cartData);

        let totalPrice = 0;
        let newsalePriceSum = 0
        cartData.forEach((item) => {
          if (item.unit_price) {
            totalPrice += item.total_price || 0;
          } else if (item.sale_unit_price) {

            totalPrice += item.sale_unit_price || 0;
          }

          if (item.sale_unit_price) {
            let unitDiscount = item.unit_price - item.sale_unit_price || 0;
            newsalePriceSum += unitDiscount * item.quantity || 0;
          }
        });

        setTotal(totalPrice);
        setSaleTotalPrice(newsalePriceSum)

      } else {
        setCartItems([]);
      }
    }

    if (session === true) {
      try {
        const response = await fetch("https://e-commerce-v2-hts6.vercel.app/api/cart/show", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (response.ok) {
          setCartItems(data.shopping_cart || []);
          setTotal(data.totalPrice || 0);
          setSaleTotalPrice(data.salePriceSum || 0);
        } else {
          alert(data.error || "Ett fel uppstod vid hämtning av varukorgen.");
        }
      } catch (error) {
        alert("Något gick fel. Försök igen");
      }
    }
  };

  //Lägger till produkter i varukorgen för utloggade och inloggade användare
  const addToCart = async (product, product_id) => {
    if (
      !product ||
      !product.id ||
      !product.title ||
      !product.price ||
      !quantity
    ) {
      alert("Produkten är ogiltig och kan inte läggas till i varukorgen.");
      return;
    }


    // Lägg till produkten i localStorage om inte inloggad
    if (!session) {
      setCartItems((prevCart) => {
        const existingProductIndex = prevCart.findIndex(
          (item) => item.product_id === product.id
        );

        let updatedCart;
        let priceToUse = 0;
        // let saleTotal = 0;


        if (existingProductIndex !== -1) {
          updatedCart = prevCart.map((item, index) => {

            if (item.sale_unit_price) {
              priceToUse += item.sale_unit_price
            } else if (item.unit_price) {
              priceToUse += item.unit_price
            }

            if (index === existingProductIndex) {
              return {
                ...item,
                quantity: item.quantity + quantity,
                total_price: priceToUse * (item.quantity + quantity),
              };
            } else {
              return item;
            }
          });
        } else {

          if (product.sale_price) {
            priceToUse += product.sale_price
          } else if (product.price) {
            priceToUse += product.price
          }

          const productToAdd = {
            product_id: product.id,
            product_title: product.title,
            unit_price: product.price,
            sale_unit_price: product.sale_price,
            product_img: product.img,
            total_price: priceToUse * quantity,
            quantity: quantity,
          };

          console.log("Total price: ", priceToUse);


          updatedCart = [...prevCart, productToAdd];
        }

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      });
    }

    // Lägg till produkter för inloggade användare
    else if (session) {
      try {
        const response = await fetch(
          "https://e-commerce-v2-hts6.vercel.app/api/cart/addtocart",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product_id, quantity }),
          }
        );
        const data = await response.json();
        console.log(session);

        if (response.ok) {
          await showCart();
        } else {
          alert(data.error);
        }
      } catch (error) {
        console.error("Ett oväntat fel inträffade. Försök igen");
      }
    }
  };

  //Uppdaterar produkterer i varukorgen för inloggade användare
  const updateCartQty = async (product_id, newQty) => {
    try {
      const response = await fetch("https://e-commerce-v2-hts6.vercel.app/api/cart/update", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id, quantity: newQty }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          await showCart();
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Ett oväntat fel inträffade. Försök igen");
    }
  };

  //Lägger till produkter från LocalStorage i databsen vid inloggning
  const checkLocalStorage = async () => {
    if (cart.length > 0 && session) {
      for (let i = 0; i < cart.length; i++) {
        const product_id = cart[i].product_id;
        const quantity = cart[i].quantity;

        try {
          const response = await fetch(
            "https://e-commerce-v2-hts6.vercel.app/api/cart/addtocart",
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ product_id, quantity }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            alert(data.error);
          }
        } catch (error) {
          console.error("Ett oväntat fel inträffade. Försök igen");
        }
      }
      localStorage.removeItem("cart");
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(
        "https://e-commerce-v2-hts6.vercel.app/api/cart/delete",
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Produkter tillagda i databasen.");
        setCartItems("");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        quantity,
        cartMessages,
        total,
        addToCart,
        setQuantity,
        showCart,
        setCartItems,
        setCartMessages,
        updateCartQty,
        setTotal,
        clearCart,
        saleTotalPrice,
        setSaleTotalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
