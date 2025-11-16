import React, { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductsApiContext } from "../../Context/ProductsContext";
import { ProductContext } from "../../Context/ProductContext";

import { IoCloseOutline } from "react-icons/io5";

export default function ShowSelectedFilters() {
  const {
    categoryID,
    setCategoryID,
    livePrice,
    setLivePrice,
    price,
    setPrice,
  } = useContext(ProductsApiContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const newParams = new URLSearchParams(searchParams);
  const { categories } = useContext(ProductContext);

  const currentFilterCategory = categories.find((c) => c.id === categoryID);

  const removeSelectedFilter = (selectedFilter) => {
    if (selectedFilter === "categoryID" && categoryID) {
      setCategoryID("");
      newParams.delete("categoryID");
      newParams.delete("page");
    }

    if (selectedFilter === "price" && price) {
      setPrice(0);
      setLivePrice(0);
      newParams.delete("page");
    }

    setSearchParams(newParams);
  };

  return (
    (price || categoryID) && (
      <div className="selected-filters-wrapper">
        <div className="selected-filters">
          <h2>Aktiva filter</h2>

          <div className="selected-filters-content">
            {categoryID && (
              <div
                className="selected-category"
                onClick={() => removeSelectedFilter("categoryID")}
              >
                {currentFilterCategory && (
                  <h3>{currentFilterCategory.category}</h3>
                )}
                <IoCloseOutline />
              </div>
            )}

            {/* {price > 0 && (
              <div
                className="selected-price"
                onClick={() => removeSelectedFilter("price")}
              >
                <h3>{livePrice}</h3>
                <IoCloseOutline />
              </div>
            )} */}
          </div>
        </div>
      </div>
    )
  );
}
