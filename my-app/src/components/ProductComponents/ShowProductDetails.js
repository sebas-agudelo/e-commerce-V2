import { useContext, useEffect, useState } from "react";
import { PiShoppingCartThin } from "react-icons/pi";
import { IoMdCheckmark } from "react-icons/io";
import { CartContext } from "../../Context/CartContext";
import ContentSpinner from "../spinners/ContentSpinner";
import ButtonSpinner from "../spinners/ButtonSpinner";
import { FaCircle } from "react-icons/fa6";
import { ProductContext } from "../../Context/ProductContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

import { Navigation, Pagination, Mousewheel } from "swiper/modules";


import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/mousewheel";
import "swiper/css/free-mode";


export default function ShowProductDetails() {
  const { productData, isLoading } = useContext(ProductContext);
  const { addToCart, isAddingToCart } = useContext(CartContext);
  const [isCollapseOpen, setIsCollapseOpen] = useState([]);

  let saved;
  if (productData?.sale_price) {
    saved = productData?.price - productData?.sale_price;
  }

  let stock;
  let className;

  if (productData?.purchase_count === 0) {
    className = `out-of-stock`;
    stock = `slut i lager`;
  } else if (productData?.purchase_count <= 5) {
    className = `low-stock`;
    stock = `få kvar`;

  } else {
    className = `in-stock`;
    stock = `i lager`;
  }

  const collapse = (key) => {
    setIsCollapseOpen(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  }

  return (
    <>
      {isLoading ? <ContentSpinner /> : <>
        <article className="product-preview">

          <h1>{productData?.title}</h1>

          <Swiper
            modules={[Navigation, Pagination, Mousewheel]}
            slidesPerView={1}
            navigation
            mousewheel={{
              forceToAxis: true,
              releaseOnEdges: true
            }}
            pagination={{ clickable: true }}
          >

            {productData?.images?.length > 0 ?

              productData?.images?.map((img, index) => (
                <SwiperSlide>
                  <div
                    style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
                    className="image-wrapper">
                    <div
                      className="img"
                      style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                      <img
                        key={index}
                        src={img.img}
                        alt={productData?.title}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))
              :
              <SwiperSlide>
                <div
                  style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
                  className="image-wrapper">
                  <div
                    className="img"
                    style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  >
                    <img
                      style={{ width: "450px" }}

                      src={productData?.img}
                      alt={productData?.title}
                    />
                  </div>
                </div>
              </SwiperSlide>
            }
          </Swiper>

          <div className="short-info-section">
            {productData?.short_description ?
              <div className="short-description">
                <h3>Kort om produkten</h3>
                <p>{productData?.short_description}</p>
              </div>
              : null}


            <div className="technical-specs">
              <h3>Teknisk specifikation</h3>
              <p>Förbindelse {productData?.connection_type}</p>
              <p>Laddningstid {productData?.charging_time}h</p>
              <p>Upp till {productData?.battery_life}h batteritid</p>
            </div>
          </div>
        </article>

        <article className="title-and-actions">
          <p id="title">{productData?.title}</p>

          {productData?.title && productData?.connection_type && productData?.battery_life ?
            <div className="product-features">
              <p>{productData?.title} är utrustade med {productData?.connection_type} och upp till {productData?.battery_life} timmars batteritid</p>
            </div>
            :
            null
          }

          {productData?.sale_price ?
            <div className="price-container">
              <p className="sale_price">{productData?.sale_price} kr.</p>
              <div className="price-info">
                <p className="savings">SPARA <span className="savings-value">{saved} kr.</span></p>
                <p className={`price ${productData?.sale_price ? "mmm" : ""}`}>Ord pris <span>{productData?.price} kr.</span></p>
              </div>
            </div>
            :
            <div className="price-container">
              <p className="price">{productData?.price} kr.</p>
            </div>
          }

          <div className="stock-cart-container">
            <div className="stock-container">
              <p className={className}><span><FaCircle /></span>{stock}</p>
            </div>

            {productData?.purchase_count > 0 ?
              <button
                className="add-cart-btn"
                onClick={() => addToCart(productData, productData.id)}
              >
                {isAddingToCart ? <ButtonSpinner /> : <> <PiShoppingCartThin />
                  Lägg i varukorgen</>}

              </button>
              :
              <button
                className="add-cart-btn-disabled"
              >
                Tillfälligt slut
              </button>
            }
          </div>

          <div className="product-benefits">
            <p>
              <IoMdCheckmark /> Säker betalning
            </p>
            <p>
              <IoMdCheckmark />
              30-dagars öppet köp
            </p>
            <p>
              <IoMdCheckmark />
              Fri frakt
            </p>
          </div>
        </article>

        <article className="product-collapse" style={{ width: "100%" }}>

          <div className="collapse-description" id="product-description">
            {isCollapseOpen.includes(1) ? (
              <div className="collapse-description-content">
                <div onClick={() => collapse(1)} className="collapse-close">
                  Produktbeskrivning <IoIosArrowUp />
                </div>

                <div className="container">
                  <h4>{productData?.title}</h4>
                  <p>{productData?.description}</p>

                </div>

              </div>
            ) : (
              <div className="collapse-desc-open" onClick={() => collapse(1)}>
                Produktbeskrivning <IoIosArrowDown />
              </div>
            )}
          </div>

          <div className="collapse-specs" id="product-specs">
            {isCollapseOpen.includes(2) ? (
              <div className="collapse-specs-content">
                <div onClick={() => collapse(2)} className="collapse-close">
                  Specifikationer <IoIosArrowUp />
                </div>
                <div className="container">
                  <div className="collapse-product-info-container">
                    <h4>Produktinformation</h4>
                    <div className="collapse-product-info">
                      <p>Varumärke</p>
                      <span>{productData?.brand ? productData?.brand : "-"}</span>
                    </div>

                    <div className="collapse-product-info">
                      <p>Artikel-ID</p>
                      <span>{productData?.id ? productData?.id : "-"}</span>
                    </div>

                    <div className="collapse-product-info">
                      <p>EAN</p>
                      <span>{productData?.ean ? productData?.ean : "-"}</span>
                    </div>
                  </div>

                  <div className="collapse-product-info-container">
                    <h4>Egenskaper</h4>
                    <div className="collapse-product-info">
                      <p>Förbindelse</p>
                      <span>{productData?.connection_type ? productData?.connection_type : "-"}</span>
                    </div>
                    <div className="collapse-product-info">

                      <p>Hörlurs typ</p>
                      <span>{productData?.category_name ? productData?.category_name : "-"}</span>
                    </div>

                    <div className="collapse-product-info">
                      <p>Mikrofon</p>
                      <span>{productData?.microphone ? productData?.microphone : "-"}</span>
                    </div>
                  </div>

                  <div className="collapse-product-info-container">
                    <h4>Batteri och ström</h4>
                    <div className="collapse-product-info">
                      <p>Typ av laddningskabel</p>
                      <span>{productData?.cabel ? productData?.cabel : "-"}</span>
                    </div>
                    <div className="collapse-product-info">
                      <p>Batteritid (upp till)</p>
                      <span>{productData?.battery_life ? productData?.battery_life + "h" : "-"}</span>
                    </div>
                    <div className="collapse-product-info">
                      <p>Laddningstid</p>
                      <span>{productData?.charging_time ? productData?.charging_time + "h" : "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="collapse-specs-open" onClick={() => collapse(2)}>
                Specifikationer <IoIosArrowDown />
              </div>
            )}
          </div>
        </article>
      </>}
    </>
  )
}
