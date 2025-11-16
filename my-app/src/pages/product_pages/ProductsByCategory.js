import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../Footer";
import ShowProdcuts from "../../components/ProductComponents/ShowProdcuts";
import { ProductsApiContext } from "../../Context/ProductsContext";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function ProductsByCategory() {
  const { selectedCatId, category } = useParams();
  const [searchParams] = useSearchParams();
  const urlPage = parseInt(searchParams.get("page")) || 1;
  const nav = useNavigate();
  
  const { fetchProducts, currenPage, price, setProductLoading} =
    useContext(ProductsApiContext);

    useEffect(() => {   
      if (selectedCatId && currenPage === urlPage) {
        fetchProductByCategory();
      };
    }, [currenPage, price, selectedCatId, urlPage]);
  
  const fetchProductByCategory = async () => {
    setProductLoading(true)
    try {
      let url = `https://e-commerce-v2-hts6.vercel.app/api/product/categori/${selectedCatId}?page=${currenPage}`;

      if (price) {
        url += `&price=${price}`;
      } 

    await fetchProducts(url);

    } catch (error) {
      alert("Ett oväntat fel har inträffat. Försök igen.")
    } finally{
      setProductLoading(false)
    }
  };

  return (
    <main className="Products-main">
      <ShowProdcuts selectedCatId={selectedCatId} category={category} />
      <Footer />
    </main>
  );
}
