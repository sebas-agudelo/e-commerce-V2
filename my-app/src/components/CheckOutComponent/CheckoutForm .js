import React, { useContext, useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { CartContext } from "../../Context/CartContext";
import { AuthSessionContext } from "../../Context/SessionProvider";


const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const { session } = useContext(AuthSessionContext);
  const { cartItems, total, saleTotalPrice } = useContext(CartContext);

  const [isUserInfoEditable, setIsUserInfoEditable] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [userInputError, setUserInputError] = useState({});
  const [isCheckedItem, setIsCheckedItem] = useState(false);
  const [toThePayment, setToThePayment] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isClicked, setIsClicked] = useState(true);

  const [paymentUserData, setPaymentUserData] = useState({
    email: "",
    birthday: "",
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    postal: "",
  });

  useEffect(() => {
    if (session) {
      fetchAuthUserData();
    }
  }, []);

  //Egenskaperna till produkterna som ska skickas till backend i både submitAuthUserOrder och submitGuestOrder
  const ItemsToSend = cartItems.map((p) => ({
    product_id: p.product_id,
    product_title: p.product_title,
    quantity: p.quantity,
    unit_price: p.unit_price,
    total_price: p.total_price,
    sale_unit_price: p.sale_unit_price
  }));

  const fetchAuthUserData = async () => {
    try {
      const response = await fetch(`https://e-commerce-v2-hts6.vercel.app/auth/profile`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (Array.isArray(data.users_info)) {
        if (response.ok) {
          const userData = data.users_info[0];
          if (userData) {
            setPaymentUserData({
              birthday: userData.birthday || "",
              email: userData.email || "",
              firstname: userData.firstname || "",
              lastname: userData.lastname || "",
              phone: userData.phone || "",
              address: userData.address || "",
              postal: userData.postal || "",
            });

            setIsUserInfoEditable(true);
          } else {
            setIsUserInfoEditable(false);
          }
        }
      }
    } catch (error) {
      alert("Ett oväntat fel har inträffat. Försök igen");
    }
  };

  //Gå vidare till betalning
  const validateBeforePayment = async () => {
    //Objektet för att kontrollera användarensuppgift data vid betalning.
    const guestDataObject = {
      email: paymentUserData.email,
      firstname: paymentUserData.firstname,
      lastname: paymentUserData.lastname,
      birthday: paymentUserData.birthday,
      phone: paymentUserData.phone,
      address: paymentUserData.address,
      postal: paymentUserData.postal,
    };

    //Validerar gäst och inloggad användarensdata i backend.
    try {
      const response = await fetch(
        // https://examensarbeten.vercel.app/api/user/validation
        `https://e-commerce-v2-hts6.vercel.app/api/user/validation`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(guestDataObject),
        }
      );

      const data = await response.json();

      if (data.success === "true") {
        setIsCompleted(true);
        setToThePayment(false);
        setIsClicked(false);
      }

      if (!response.ok) {
        // alert(data.error);

        setUserInputError(data.errors);

        return;
      }
    } catch (error) {
      alert("Ett oväntat fel har inträffat. Försök igen.");
    }
  };

  //Skickar produkterna/produkten för att skapa en order för en inloggad användare.
  const submitAuthUserOrder = async () => {
    try {
      const response = await fetch(`https://e-commerce-v2-hts6.vercel.app/api/order/insert`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ItemsToSend, email: paymentUserData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.success);
      }
      if (!response.ok) {
        // alert(data.error);
        return data.error
      }
    } catch (error) {
      return "Ett oväntat fel har inträffat. Var vänlig försök igen"
    }
  };

  //Skickar produkterna/produkten för att skapa order för en utloggad användare.
  const submitGuestOrder = async () => {
    try {
      const guestDataObject = {
        email: paymentUserData.email,
        firstname: paymentUserData.firstname,
        lastname: paymentUserData.lastname,
        birthday: paymentUserData.birthday,
        phone: paymentUserData.phone,
        address: paymentUserData.address,
        postal_code: paymentUserData.postal,
      };

      const response = await fetch(
        "https://e-commerce-v2-hts6.vercel.app/api/order/guestorder",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ItemsToSend, guestDataObject }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return data.error || "OPS. Något har gått fel.";
      };

      return null
      
    } catch (error) {
      // alert("Ett oväntat fel har inträffat. Försök igen");
     return "Ett oväntat fel har inträffat. Var vänlig försök igen";
    }
  };

  const startEditingUserInfo = () => {
    setIsUserInfoEditable(false);
  };

  //Gå vidare till användarinformationen
  const proceedToCustomerInfo = () => {
    setIsCheckedItem(true);
    setToThePayment(true);
  };

  //Gå tillbaka till orderöversitt
  const returnToOrderSummary = () => {
    setIsCheckedItem(false);
    setToThePayment(false);
    setIsCompleted(false);
  };

  //Funktionen för att gå tillbaka till kunduppgifter
  const returnToCustomerInfo = () => {
    setToThePayment(true);
    setIsCompleted(false);
    setIsCheckedItem(true);
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;

    setPaymentUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (userInputError && userInputError[name]) {
      setUserInputError((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    const payment_success_redirect_url =
      "https://e-commerce-v2-dycs.vercel.app//payment-success";

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    } 

      try {
      const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: payment_success_redirect_url },
      redirect: "if_required",
    });

    if (stripeError) {
      alert(stripeError.message);
      return; // evita redirect
    }

    let orderError = null;
    if (session) {
      orderError = await submitAuthUserOrder(); // devuelve null o mensaje de error
    } else {
      orderError = await submitGuestOrder();
      if (!orderError) localStorage.removeItem("cart");
    }

    if (orderError) {
      alert(orderError);
      return; // evita redirect
    }

    // Solo redirigir si todo fue exitoso
    window.location.href = payment_success_redirect_url;
  } catch (err) {
    console.error(err);
    alert("Ett oväntat fel har inträffat. Försök igen.");
    return;
  }
  };

  return (
    <main className="checkout-container">
      <section className="checkout-section-wrapper">
        {isCheckedItem ? (
          <div className="checkout-show-order">
            <h1>Orderöversitt</h1>
            <p onClick={returnToOrderSummary}>Visa</p>  
          </div>
        ) : (
          <>
            <article className="ckeckout-order-items">
              <h1>Orderöversitt</h1>
              {cartItems.map((item) => (
                <div className="order-items">
                  <div className="order-items-img">
                    <img src={item.product_img} />
                  </div>

                  <div className="checkout-items-details">
                    <div className="order-items-details">
                      
                      <div className="order-items-text">
                      <p>{item.product_title}</p>
                      <p>Antal: {item.quantity}</p>
                      </div>


                      <div className="order-items-pricies">
                      {item.sale_unit_price ? 
                      <>
                      <p className={`checkout-unit_price ${item.sale_unit_price ? "mmm" : ""}`}>{item.unit_price} kr.</p>
                      <p className="checkout-sale_unit_price">{item.sale_unit_price} kr.</p>
                      </>
                        : 
                      <p className="checkout-unit_price">{item.unit_price} kr.</p>
                        
                      }
                      </div>
             
                    </div>
                  </div>
                </div>
              ))}

              <div className="checkout-total-price">
                <p id="checkout-sale_price">Du sparar: <span className="discount-total">{saleTotalPrice ? `${saleTotalPrice}.00 kr.` : "0 kr."}</span></p>
                 <p className="Shipping">Frakt: <span>0 kr.</span></p>
                <p id="checkout-price">Totalbelopp: <span>{total}.00 kr.</span></p>
              </div>

              <div className="checkout-to-costumer-info-btn">
                <p onClick={proceedToCustomerInfo}>Nästa - Kunduppgifter</p>
              </div>
            </article>
          </>
        )}

        <article className="checkout-form">
          {/* <UserInputError userInputMessage={userInputError}/> */}
          <form onSubmit={handleSubmit}>
            {toThePayment ? (
              <>
                <article className={`checkout-user-form`}>
                  <h1>Kunduppgifter</h1>

                  <div className="peronnr-email-wrapper">
                    <div className="payment-user-data-input-wrapper">
                      <input
                        id="personnr"
                        type="number"
                        placeholder="Personnummer"
                        required
                        name="birthday"
                        value={paymentUserData.birthday}
                        onChange={handlePaymentInputChange}
                        disabled={isUserInfoEditable}
                      />
                      {userInputError.birthday && (
                        <p className="payment-user-error-message">
                          {userInputError.birthday}
                        </p>
                      )}
                    </div>

                    <div className="payment-user-data-input-wrapper">
                      <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        required
                        name="email"
                        value={paymentUserData.email}
                        onChange={handlePaymentInputChange}
                        disabled={isUserInfoEditable}
                      />
                      {userInputError.email && (
                        <p className="payment-user-error-message">
                          {userInputError.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="firstname-lastname-wrapper">
                    <div className="payment-user-data-input-wrapper">
                      <input
                        type="text"
                        placeholder="Förnamn"
                        required
                        name="firstname"
                        value={paymentUserData.firstname}
                        onChange={handlePaymentInputChange}
                        disabled={isUserInfoEditable}
                      />
                      {userInputError.firstname && (
                        <p className="payment-user-error-message">
                          {userInputError.firstname}
                        </p>
                      )}
                    </div>
                    <div className="payment-user-data-input-wrapper">
                      <input
                        type="text"
                        placeholder="Efternamn"
                        required
                        name="lastname"
                        value={paymentUserData.lastname}
                        onChange={handlePaymentInputChange}
                        disabled={isUserInfoEditable}
                      />
                      {userInputError.lastname && (
                        <p className="payment-user-error-message">
                          {userInputError.lastname}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="phonenumber-wrapper">
                    <input
                      type="number"
                      placeholder="Telefonnummer"
                      required
                      name="phone"
                      value={paymentUserData.phone}
                      onChange={handlePaymentInputChange}
                      disabled={isUserInfoEditable}
                    />
                    {userInputError.phone && (
                      <p className="payment-user-error-message">
                        {userInputError.phone}
                      </p>
                    )}
                  </div>

                  <div className="address-postalcode-wrapper">
                    <div className="payment-user-data-input-wrapper">
                      <input
                        id="address"
                        type="text"
                        placeholder="Address"
                        required
                        name="address"
                        value={paymentUserData.address}
                        onChange={handlePaymentInputChange}
                        disabled={isUserInfoEditable}
                      />
                      {userInputError.address && (
                        <p className="payment-user-error-message">
                          {userInputError.address}
                        </p>
                      )}
                    </div>
                    <div className="payment-user-data-input-wrapper">
                      <input
                        id="postalcode"
                        type="text"
                        placeholder="Postnummer"
                        required
                        name="postal"
                        value={paymentUserData.postal}
                        onChange={handlePaymentInputChange}
                        disabled={isUserInfoEditable}
                      />
                      {userInputError.postal && (
                        <p className="payment-user-error-message">
                          {userInputError.postal}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="checkout-to-payment-btn">
                    <p
                      className="change-auth-user-info-btn"
                      onClick={startEditingUserInfo}
                    >
                      {isUserInfoEditable ? "Ändra uppgifter" : ""}
                    </p>

                    <p className="checkout-btn" onClick={validateBeforePayment}>
                      Fortsätt - Betalning
                    </p>
                  </div>
                </article>
              </>
            ) : (
              <>
                <div className="checkout-costumer-info">
                  <h1>Kunduppgifter</h1>
                  {isClicked ? "" : <p onClick={returnToCustomerInfo}>Visa</p>}
                </div>
              </>
            )}
            {isCompleted ? (
              <article className="checkout-payment-wrapper">
                <PaymentElement />
                <div className="checkout-pay-btn-wrapper">
                  <button className="pay-btn" disabled={!stripe}>
                    Betala
                  </button>
                </div>
                {/* Show error message to your customers */}
                {errorMessage && <div>{errorMessage}</div>}
              </article>
            ) : (
              <>
                <div className="checkout-show-payment">
                  <h1>Betalningssätt</h1>
                </div>
              </>
            )}
          </form>
        </article>
      </section>
    </main>
  );
};

export default CheckoutForm;
