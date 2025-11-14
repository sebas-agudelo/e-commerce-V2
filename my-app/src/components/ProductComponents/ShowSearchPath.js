import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { ProductsApiContext } from "../../Context/ProductsContext";

export default function ShowSearchPath({ selectedCatId, category }) {
  const [currentPath, setCurrentPath] = useState();
  const [searchParams] = useSearchParams();
  const {count} = useContext(ProductsApiContext)
  const location = useLocation();
  const path = location.pathname;

  const [searchQuery, setSearchQuery] = useState("");

  const queryFromURL = searchParams.get("query") || "";

  useEffect(() => {
    if (path === "/products") {
      setCurrentPath("ALLA PRODUKTER");
    }
    if (
        path === `/products/${selectedCatId}/cat/${category}`
    ) {
      setCurrentPath(category);      
    }
    if (path === "/search") {
      setCurrentPath("Sökresultat");
      setSearchQuery(queryFromURL);
    }
  }, [location.pathname, queryFromURL]);
  return (
    <div>
      {searchQuery ? (
        <div className="search-text-wrapper">
          <h2>{currentPath}: <span>{count}</span></h2>
          <h1>{searchQuery}</h1>
        </div>
      ) : (
        <h1 className="path">
          {currentPath}
        </h1>
      )}
    </div>
  );
}
