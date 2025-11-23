import React, { useContext, useEffect, useState } from "react";
import ShowFilters from "./ShowFilters";
import { Link } from "react-router-dom";
import ShowPagination from "./ShowPagination";
import { ProductsApiContext } from "../../Context/ProductsContext";
import ShowSelectedFilters from "./ShowSelectedFilters";
import ShowSearchPath from "./ShowSearchPath";
import ShowErrors from "../ShowMessagies/ShowErrors";
import PageNotFound from "../../pages/PageNotFound";
import Spinners from "../spinners/Spinners";
import ContentSpinner from "../spinners/ContentSpinner";
import { IoCheckmarkOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";

export default function ShowProdcuts({ category, selectedCatId }) {
  const { products, invalidCategory, invalidFilter, productLoading } =
    useContext(ProductsApiContext);

  const [isSalePrice, setIsSalePrice] = useState(false);

  return (
    <>
      {invalidCategory ? (
        <PageNotFound />
      ) : (
        <section className="products-container">
          {invalidFilter ? (
            <ShowErrors />
          ) : (
            <>
              <div className="products-toolbar">
                <ShowSearchPath
                  selectedCatId={selectedCatId}
                  category={category}
                />

                <ShowSelectedFilters />

                <ShowFilters
                  selectedCatId={selectedCatId}
                  category={category}
                />
              </div>

              {productLoading ? <ContentSpinner /> :
                <>
                  {products &&
                    products.map((product) => (
                      <article key={product.id} className="product-wrapper">
                        <Link to={`/product/${product.id}`}>
                          <div className="product-img-wrapper">
                            <div className="product-img">
                              <img src={product.img} alt={product.title} />
                            </div>
                          </div>

                          <div className="product-details">
                            <p id="brand">{product.brand}</p>
                            <p id="title">{product.title}</p>

                              <ul>
                                    <li>
                                        {product.category_name}
                                    </li>
                                    <li>
                                        Laddningstid: {product.charging_time}h
                                    </li>
                                    <li>
                                        Batteritid: {product.battery_life}h
                                    </li>
                                </ul>

                            {product.sale_price ?
                              <>
                                <p id="price" className={product.sale_price ? "mmm" : ""}>{product.price}.00 kr.</p>
                                <p id="sale_price">{product.sale_price}.00 kr.</p>
                              </>
                              : <p id="price">{product.price}.00 kr.</p>
                            }
                            <p className="purchase_count">{product.purchase_count > 0 ? <span className="mark">< IoCheckmarkOutline /></span> : <span className="closee">< IoCloseOutline /></span>} i lager</p>

                          </div>
                          {product.purchase_count === 0 &&
                            <div className="out-of-stock">
                              <p>Tillfälligt slut</p>
                            </div>
                          }
                        </Link>

                      </article>
                    ))}

                  <ShowPagination />
                </>
              }
            </>
          )}
        </section>
      )}
    </>
  );
}
