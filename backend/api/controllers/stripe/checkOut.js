import { supabase_config } from "../../supabase_config/supabase_conlig.js";
import stripe from "stripe";
import dotenv from "dotenv";

const supabase = supabase_config();
dotenv.config();

const stripePay = stripe(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items) => {
  if (items.length === 0) return 100 * 100;
  const totalAmount = items.reduce(
    (acc, product) => acc + product.unit_price * product.quantity,
    0
  );
  return totalAmount * 100;
};

export const stripeCheckOut = async (req, res) => {
  const { items } = req.body;

  try {
    if (items.length === 0) {
      console.log(`Varukorgen är tom`);
      return res.status(400).json({ message: "Varukorgen är tom" });
    } else {
      const metadata = items
        .map((item, index) => {
          return `Product${index + 1}: ${item.product_title}, Price: ${
            item.unit_price
          }, Quantity: ${item.quantity}`;
        })
        .join("; ");

      const paymentIntent = await stripePay.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "sek",
        payment_method_types: ["card"],
        metadata: { orderDetails: metadata },
      });

      return res
        .status(200)
        .json({ client_secret: paymentIntent.client_secret });
    }
  } catch (error) {
    console.error("Stripe Error:", error.message);
    return res
      .status(500)
      .json({ error: "Något gick fel. Försök igen" });
  }
};
