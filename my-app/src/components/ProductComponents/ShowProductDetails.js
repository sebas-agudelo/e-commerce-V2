import React, { useContext, useState } from "react";
import { PiShoppingCartThin } from "react-icons/pi";
import { IoMdCheckmark } from "react-icons/io";
import { VscChromeClose } from "react-icons/vsc";
import { CartContext } from "../../Context/CartContext";
import ButtonSpinner from "../spinners/ButtonSpinner";
import { ProductContext } from "../../Context/ProductContext";

export default function ShowProductDetails({ productData }) {
  const [isClicked, setIsClicked] = useState(false);
  const { addToCart, isAddingToCart } = useContext(CartContext);
  const {productData} = useContext(ProductContext);

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

        {productData?.sale_price ?
          <>
            <p className={`price ${productData?.sale_price ? "mmm" : ""}`}>{productData?.price}.00 kr.</p>
            <p className="sale_price">{productData?.sale_price}.00 kr.</p>
          </>
          :
          <p className="price">{productData?.price}.00 kr.</p>
        }

        {productData?.purchase_count > 0 ?
          <button
            className="add-cart-btn"
            onClick={() => addToCart(productData, productData.id)}
          >
            {isAddingToCart ? <ButtonSpinner />: <> <PiShoppingCartThin />
            Lägg i varukorgen</>}

          </button>
          :
          <button
            className="add-cart-btn-disabled"
          >
            Tillfälligt slut
          </button>
        }

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
