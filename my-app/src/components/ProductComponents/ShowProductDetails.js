import React, { useContext, useState } from "react";
import { PiShoppingCartThin } from "react-icons/pi";
import { IoMdCheckmark } from "react-icons/io";
import { VscChromeClose } from "react-icons/vsc";
import ProductStates from "../../hooks/ProductStates";
import { CartContext } from "../../Context/CartContext";

export default function ShowProductDetails({productData}) {
      const [isClicked, setIsClicked] = useState(false);
      const {addToCart} = useContext(CartContext);

      const readMoreOpen = () => {
        setIsClicked(true);
      };
    
      const readMoreClose = () => {
        setIsClicked(false);
      };
    
  return (
    <>
 <div className="image-wrapper">
          <img src={productData?.img} alt={productData?.title} />
        </div>

        <article className="title-and-actions">
          <p id="title">{productData?.title}</p>
          <p id="price">{productData?.price}.00 kr.</p>
          <p id="price">{productData?.sale_price} kr.</p>


          <button
            className="add-cart-btn"
            onClick={() => addToCart(productData, productData.id)}
          >
            <PiShoppingCartThin />
            Lägg i varukorgen
          </button>

          <div className="additional-info">
            <p>
              <IoMdCheckmark /> Säker betalning
            </p>
            <p>
              <IoMdCheckmark />
              30-dagars öppet köp
            </p>
            <p>
              <IoMdCheckmark />
              Garanti: {productData?.garanti}år
            </p>
          </div>
        </article>

        <article className="description">
          <div className="dddd">
            <span>Produktbeskrivning</span>
            {isClicked ? (
              <span onClick={readMoreClose}>
                <VscChromeClose />
              </span>
            ) : (
              ""
            )}
          </div>

          <p className={isClicked ? "isClicked" : ""}>
            {productData?.description}
          </p>

          {isClicked ? "" : <button onClick={readMoreOpen}>Läs mer</button>}
        </article>

        <article className="specifications">
          <span>Specifikationer</span>
          <p>Märke: {productData?.brand}</p>
          <p>Betteritid: {productData?.battery_life}h</p>
          <p>Anslutning: {productData?.connection_type}</p>
        </article>
        </>
  )
}
