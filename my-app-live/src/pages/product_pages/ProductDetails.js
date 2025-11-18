import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductStates from "../../hooks/ProductStates";
import ShowProductDetails from "../../components/ProductComponents/ShowProductDetails";
import Footer from "../Footer";

export default function ProductDetails() {
  const [productData, setProductData] = ProductStates();
  const { id } = useParams();
  
  useEffect(() => {
    fetchProductById(id)
  }, [id]);

  const fetchProductById = async (id) => {
    try {
      const response = await fetch(
        `https://e-commerce-v2-hts6.vercel.app/api/product/get/${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setProductData(data.product);
      } 
    } catch (error) {
      alert("Ett oväntat fel har inträffat. Försök igen");
    }
  };

  return (
    <main className="product-details" style={{ paddingTop: "65px" }}>
      <section>
        <ShowProductDetails productData={productData}/>
      </section>
      <Footer />
    </main>
  );
}
