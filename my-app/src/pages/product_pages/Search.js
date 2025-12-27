import React, { useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import ShowProdcuts from "../../components/ProductComponents/ShowProdcuts";
import Footer from "../Footer";
import { ProductsApiContext } from "../../Context/ProductsContext";

const ProductSearch = () => {
  const {
    fetchProducts,
    setCategoryID,
    setProductLoading,
    setMinprice,
    setMaxprice,
    setMino,
  } = useContext(ProductsApiContext);
  
  const [searchParams] = useSearchParams();
    const queryFromURL = searchParams.get("query") || "";
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
     fetchSearchProducts(queryFromURL);
   }, [queryFromURL, urlPage, urlCategory, minuumPrice, maxiumPrice, urlOrder]);
 

  const fetchSearchProducts = async (query) => {
    setProductLoading(true)

     const backendParams = new URLSearchParams();

      backendParams.set("page", urlPage);
      if (urlCategory) backendParams.set("categoryID", urlCategory);
      if (minuumPrice) backendParams.set("minPrice", minuumPrice);
      if (maxiumPrice) backendParams.set("maxPrice", maxiumPrice);
      if (urlOrder) backendParams.set("mino", urlOrder);
    
    try {


      let url = `https://e-commerce-v2-hts6.vercel.app/search?query=${query}&${backendParams.toString()}`;
      
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
};

export default ProductSearch;
