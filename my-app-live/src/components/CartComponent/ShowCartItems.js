import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import { BsPlusLg } from "react-icons/bs";
import { PiMinusThin } from "react-icons/pi";
import { paymethods } from "../../data/paymentMethods";
import ContentSpinner from "../spinners/ContentSpinner";

export default function ShowCartItems({ reduceQty, incruseQty }) {
  const { cartItems, total, saleTotalPrice, isLoading } = useContext(CartContext);

  return (
    <>
    {isLoading ? <ContentSpinner /> : 
    <>
      {cartItems && cartItems.length === 0 ? (
        <article className="cart-content-empty">
          <div className="empty-cart-container">
            <h1>Varukorgen är tom</h1>
            <Link to={`/products`}>Till butiken</Link>
          </div>
        </article>
      ) : (
        <article className="cart-content">
          {cartItems.map((item) => (
            <article className="cart-items" key={item.product_id}>
              <article className="cart-title-img">
                <div className="cart-img">
                  <Link to={`/product/${item.product_id}`}>
                    <img src={item.product_img} alt={item.product_title} />
                  </Link>
                </div>
                <div className="cart-title-price">
                  <p className="cart-product-title">{item.product_title}</p>
                  <p className="cart-product-qty">Antal: {item.quantity}</p>
                </div>
              </article>

              <article className="qty-items">
                {item.sale_unit_price && item.sale_unit_price ?
                  <>
                    <p className={`cart-item-price ${item.sale_unit_price ? "mmm" : ""}`}>{item.unit_price}.00kr.</p>
                    <p className="cart-item-sale_price">{item.sale_unit_price}.00 kr.</p>
                  </>
                  :
                  <p className="cart-item-price">{item.unit_price}.00kr.</p>
                }

                <div className="qty-btn">
                  <PiMinusThin onClick={() => reduceQty(item)} />
                  <p>{item.quantity}</p>
                  <BsPlusLg onClick={() => incruseQty(item)} />
                </div>
              </article>
              <div className="bor"></div>
            </article>
          ))}
        </article>
      )}

      {cartItems.length === 0 ? (
        ""
      ) : (
        <article className="checkout-container">
          <>
            <p className="discount-text">Rabetter: <span className="discount-total">{saleTotalPrice ? `${saleTotalPrice}.00 kr.` : "0 kr."}</span></p>
            <p className="Shipping">Frakt: <span>0 kr.</span></p>
            <p className="total">Summa: <span>{total ? `${total}.00 kr.` : "0"}</span></p>
            <button className="checkout-btn">
              <Link to={`/checkout`}>Till kassan</Link>
            </button>

            <div className="payment-methods">
              {paymethods?.map((method) => (
                <img src={method}/>
              ))}
            </div>
          </>
        </article>
      )}
      </>
      }
    </>
  );
}
