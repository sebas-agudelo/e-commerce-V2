import React, { useEffect, useState, useContext, use } from "react";
import { IoFilterSharp } from "react-icons/io5";
import { VscChromeClose } from "react-icons/vsc";
import { AiOutlinePlus } from "react-icons/ai";
import ShowProdcuts from "./ShowProdcuts";
import { ProductContext } from "../../Context/ProductContext";
import { ProductsApiContext } from "../../Context/ProductsContext";
import { useSearchParams } from "react-router-dom";

export default function ShowFilters({ category, selectedCatId }) {
  const {
    count,
    setCategoryID,
    categoryID,
    setCurrentPage,
    minprice,
    setMinprice,
    maxprice,
    setMaxprice,
    initallyMin,
    initallyMax,
    setMino,
    mino
  } = useContext(ProductsApiContext);


  const [isClicked, setIsClicked] = useState(false);
  const { categories } = useContext(ProductContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const newParams = new URLSearchParams(searchParams);
  const minuumPrice = searchParams.get("minprice") || ""
  const maxiumPrice = searchParams.get("maxprice") || ""
  const handleClick = () => {
    {
      isClicked ? setIsClicked(false) : setIsClicked(true);
    }
  };

  const removeFilters = () => {
    if (categoryID || minuumPrice || maxiumPrice) {
      setCategoryID("");
      setMinprice("");
      setMaxprice("");
      const newParams = new URLSearchParams();
      setSearchParams(newParams);
    }

  };

  const handleCategoryFilter = (e) => {
    const selectedCategory = e.target.value;
    newParams.set("categoryID", selectedCategory);
    setSearchParams(newParams);
    setCategoryID(selectedCategory);

    if (selectedCategory) {
      newParams.delete("page");
      newParams.delete("minprice");
      newParams.delete("maxprice");
      newParams.set("categoryID", selectedCategory);
      setSearchParams(newParams);
      setCurrentPage(1);
    }
  };

  const updateQueryParams = () => {
    if (Number(minprice) < initallyMin || Number(maxprice) > initallyMax) {
      return;
    }
    if (minprice) {
      newParams.delete("page");
      newParams.set("minprice", minprice);
    }

    if (maxprice) {
      newParams.delete("page");
      newParams.set("maxprice", maxprice);
    }

    setSearchParams(newParams);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    updateQueryParams();
  };

  const getMino = (e) => {
    const sortOrder = e.target.value;
    setMino(sortOrder);
    newParams.set("mino", sortOrder);
    setSearchParams(newParams);
  }



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
          <form
            className="price-form"
            onSubmit={handleSubmit}>
            <p>Pris</p>
            <div
              className="price-inputs"
            >
              <div
                className="price-input"
              >
                <label>Från</label>
                <input type="text"
                  placeholder="Från"
                  value={minprice}
                  onChange={(e) => setMinprice(e.target.value)}
                  onBlur={updateQueryParams}
                />
              </div>
              <div
                className="price-input"
              >
                <label>Till</label>
                <input
                  type="text"
                  placeholder="Till"
                  value={maxprice}
                  onChange={(e) => setMaxprice(e.target.value)}
                  onBlur={updateQueryParams}
                />
              </div>
            </div>
          </form>
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
              <div className="sort-by-container">
                <select className="sort-select" value={mino} onChange={getMino} >
                  <option value="0" onClick={() => setMino("")}>Relevant</option>
                  <option value="ASC" onClick={() => setMino("ASC")}>Pris: Lägst till högst</option>
                  <option value="DESC" onClick={() => setMino("DESC")}>Pris: Högst till lägst</option>
                </select>
              </div>

        <button className="filter-btn" onClick={handleClick}>
          Alla filter
          <IoFilterSharp />
        </button>
      </div>
    </div>
  );
}
