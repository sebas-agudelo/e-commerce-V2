import React, { useContext, useEffect, useState } from "react";
import { ProductsApiContext } from "../../Context/ProductsContext";
import { useSearchParams } from "react-router-dom";

import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

export default function ShowPagination() {
  const { currenPage, setCurrentPage, pages } =
    useContext(ProductsApiContext);
    
  const [searchParams, setSearchParams] = useSearchParams();
  const newParams = new URLSearchParams(searchParams);
  const urlPage = parseInt(searchParams.get("page")) || 1;
  
  const pageNumbers = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  };

  useEffect(() => {
    setCurrentPage(urlPage);
  }, [urlPage, setCurrentPage]);


  const nextPage = async () => {
    if (currenPage < pages) {
      updatePageParam(currenPage + 1);
    }
  };

  const prevPage = () => {
    if (currenPage > 1) {
      updatePageParam(currenPage - 1);
    }
  };

  
  const updatePageParam = (page) => {
    newParams.set("page", page);
    setSearchParams(newParams);
    setCurrentPage(page);
  };
  
  const handlePageChange = (page) => {
    updatePageParam(page);
  };

  return (
    <div className="pagination-container">
      <div className="pagination-btn-wrapper">
        {currenPage && currenPage === 1 ? null : 
          <button
            className="pgn-action-btn-prev"
            onClick={prevPage}
          >
            <GrPrevious />
          </button>    
        }
        

        {pageNumbers.map((page) => (
          <button
            className={`pgn-index-btn ${
              currenPage === page ? "current-page" : ""
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}

       {pages && pages === 1 ? null : 
          <button className="pgn-action-btn-next" onClick={nextPage}>
            <GrNext />
          </button>
       
       }
        
      </div>
      <p>
        Sida: {currenPage} - Av: {pages}
      </p>
    </div>
  );
}
