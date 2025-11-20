import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../components/CheckOutComponent/CheckoutForm ";
import { CartContext } from "../../Context/CartContext";
import Spinners from "../../components/spinners/Spinners";

export default function CheckOut() {
  const stripePromise = loadStripe(process.env.REACT_APP_PUBLIC_STRIPE_KEY);
  const [clientSecret, setClientSecret] = useState("");

  const {cartItems} = useContext(CartContext);

  useEffect(() => {

    fetch("https://e-commerce-v2-hts6.vercel.app/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.client_secret) {
          
          setClientSecret(data.client_secret);
        } 
      })
      .catch((err) => console.error("Error fetching client secret:", err));
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return clientSecret ? (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  ) : (
    <Spinners />
  );
  
}
