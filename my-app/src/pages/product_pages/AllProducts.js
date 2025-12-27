import React, { useContext, useEffect, useState } from "react";
import Footer from "../Footer";
import ShowProdcuts from "../../components/ProductComponents/ShowProdcuts";
import { ProductsApiContext } from "../../Context/ProductsContext";
import { useSearchParams } from "react-router-dom";

export default function Products() {
  const {
    fetchProducts,
    setCategoryID,
    setProductLoading,
    setMinprice,
    setMaxprice,
    setMino,
  } = useContext(ProductsApiContext);

  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get("categoryID") || "";
  const urlPage = parseInt(searchParams.get("page")) || 1;
  const minuumPrice = searchParams.get("minprice") || ""
  const maxiumPrice = searchParams.get("maxprice") || ""
  const urlOrder = searchParams.get("mino") || ""

  useEffect(() => {
    setCategoryID(urlCategory);
    setMinprice(minuumPrice);
    setMaxprice(maxiumPrice);
    setMino(urlOrder);
  }, [urlCategory, minuumPrice, maxiumPrice, urlOrder]);


  useEffect(() => {
    fetchAllProducts();
  }, [urlPage, urlCategory, minuumPrice, maxiumPrice, urlOrder]);

  const fetchAllProducts = async () => {
    try {
      setProductLoading(true)

      const backendParams = new URLSearchParams();

      backendParams.set("page", urlPage);
      if (urlCategory) backendParams.set("categoryID", urlCategory);
      if (minuumPrice) backendParams.set("minPrice", minuumPrice);
      if (maxiumPrice) backendParams.set("maxPrice", maxiumPrice);
      if (urlOrder) backendParams.set("mino", urlOrder);

      let url = `https://e-commerce-v2-hts6.vercel.app/api/products/show?${backendParams.toString()}`;

 await fetchProducts(url);

    } catch (error) {
      alert("Ett oväntat fel har inträffat. Försök igen.");
    } finally {
      setProductLoading(false)
    }
  };

  return (
    <main className="Products-main">
      <ShowProdcuts
      />
      <Footer />
    </main>
  );
}
