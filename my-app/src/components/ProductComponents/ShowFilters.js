import React, { useEffect, useState, useContext } from "react";
import { IoFilterSharp } from "react-icons/io5";
import { VscChromeClose } from "react-icons/vsc";
import { AiOutlinePlus } from "react-icons/ai";
import ShowProdcuts from "./ShowProdcuts";
import { ProductContext } from "../../Context/ProductContext";
import { ProductsApiContext } from "../../Context/ProductsContext";
import { useSearchParams } from "react-router-dom";

export default function ShowFilters({ category, selectedCatId }) {
  const {
    price,
    setPrice,
    setLivePrice,
    livePrice,
    count,
    setCategoryID,
    categoryID,
    setCurrentPage
  } = useContext(ProductsApiContext);

  const [isClicked, setIsClicked] = useState(false);
  const { categories } = useContext(ProductContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const newParams = new URLSearchParams(searchParams);

  const handleClick = () => {
    {
      isClicked ? setIsClicked(false) : setIsClicked(true);
    }
  };

  const removeFilters = () => {
    setPrice(0);
    setCategoryID("");
    setCurrentPage(1);
    newParams.delete("page");
    newParams.delete("categoryID");
    setSearchParams(newParams);
  };

  const handleCategoryFilter = (e) => {
    const selectedCategory = e.target.value;
    newParams.set("categoryID", selectedCategory);
    setSearchParams(newParams);
    setCategoryID(selectedCategory);

    if (selectedCategory) {
      newParams.delete("page");
      newParams.set("categoryID", selectedCategory);
      setSearchParams(newParams);
      setCurrentPage(1);
    }
  };

  return (
    <div>
      <div
        className={isClicked ? "products-filter-container" : "filter-container"}
      >
        <div className="products-filters-wrapper">
          <div className="close-filter-menu">
            <h3>Filter</h3>
            <VscChromeClose onClick={handleClick} />
          </div>
          <div className="categories-checkboxes">
            <>
              <h3>kategori</h3>
              {selectedCatId ? (
                <h3>{category}</h3>
              ) : (
                <select name="category_id" value={categoryID} onChange={handleCategoryFilter}>
                  <option value={""} selected disabled>
                    Välj kategori
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category}
                    </option>
                  ))}
                </select>
              )}
            </>
          </div>
          <div className="price-range">
            <h3>
              Pris: <span>{price}:-</span>
            </h3>
            <input
              type="range"
              min={0}
              max={2000}
              value={price}
              className="slider"
              id="myRange"
              onChange={(e) => {
                setPrice(parseInt(e.target.value));
              }}
              onMouseUp={() => setLivePrice(price)}
              onTouchEnd={() => setLivePrice(price)}
            />
          </div>

          
        </div>

        <div className="filter-actions">
          <button className="filter-buttons remove-filters" onClick={removeFilters}>
            Ta bort allt
          </button>
          <button className="filter-buttons" onClick={handleClick}>
            Filtrera <span>{count}</span>
          </button>
        </div>
      </div>

      <div className="filter-btns">
      <button className="filter-btn">
          Sortera efter 
          <AiOutlinePlus />
        </button>
        <button className="filter-btn" onClick={handleClick}>
          Alla filter
          <IoFilterSharp />
        </button>
      </div>
    </div>
  );
}
