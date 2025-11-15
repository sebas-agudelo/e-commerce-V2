import React, { useContext, useEffect, useState } from "react";
import Footer from "../Footer";
import ShowProdcuts from "../../components/ProductComponents/ShowProdcuts";
import { ProductsApiContext } from "../../Context/ProductsContext";
import { useSearchParams } from "react-router-dom";

export default function Products() {
  const {
    fetchProducts,
    price,
    currenPage,
    setCurrentPage,
    categoryID,
    setCategoryID,
    setProductLoading
  } = useContext(ProductsApiContext);

  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get("categoryID") || "";
  const urlPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    setCategoryID(urlCategory);
      setCurrentPage(urlPage);
  }, [urlCategory, urlPage]);

  useEffect(() => {
    if (categoryID === urlCategory && currenPage === urlPage) {
      fetchAllProducts();
    }
  }, [currenPage, price, categoryID, urlCategory, urlPage]);

  const fetchAllProducts = async () => {
setProductLoading(true)
    try {
      // `http://localhost:3030/api/products/show?page=${currenPage}`
      let url = `https://e-commerce-v2-hts6.vercel.app/api/products/show?page=${currenPage}`;

      if (price && categoryID) {
        url += `&price=${price}&categoryID=${categoryID}`;
      } else if (price) {
        url += `&price=${price}`;
      } else if (categoryID) {
        url += `&categoryID=${categoryID}`;
      }

      await fetchProducts(url);

      
    } catch (error) {
      alert("Ett oväntat fel har inträffat. Försök igen.");
    } finally{
      setProductLoading(false)
    }
  };

  return (
    <main className="Products-main">
      <ShowProdcuts />
      <Footer />
    </main>
  );
}
