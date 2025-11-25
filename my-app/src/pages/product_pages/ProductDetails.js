import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import ShowProductDetails from "../../components/ProductComponents/ShowProductDetails";
import Footer from "../Footer";
import { ProductContext } from "../../Context/ProductContext";

export default function ProductDetails() {

  const { fetchProductById, isLoading } = useContext(ProductContext);
  const { id } = useParams();

  useEffect(() => {
    if(isLoading) return;
    fetchProductById(id)
  }, [id]);

  return (
    <main className="product-details" style={{ paddingTop: "75px" }}>
        <>
          <section>
            <ShowProductDetails />
          </section>
        </>
      
      <Footer />

    </main>
  );
}
