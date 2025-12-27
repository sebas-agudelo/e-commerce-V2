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
  const urlCategory = searchParams.get("categoryID") || "";
  const urlPage = parseInt(searchParams.get("page")) || 1;
  const minuumPrice = searchParams.get("minprice") || ""
  const maxiumPrice = searchParams.get("maxprice") || ""
  const urlOrder = searchParams.get("mino") || ""

  const { fetchProducts, setProductLoading, setCategoryID, setMinprice, setMaxprice, setMino } =
    useContext(ProductsApiContext);

  useEffect(() => {
    setCategoryID(selectedCatId);
    setMinprice(minuumPrice);
    setMaxprice(maxiumPrice);
    setMino(urlOrder);
  }, [selectedCatId, minuumPrice, maxiumPrice, urlOrder]);

  useEffect(() => {
    fetchProductByCategory();
  }, [minuumPrice, maxiumPrice, urlOrder, selectedCatId, urlPage, urlCategory]);

  const fetchProductByCategory = async () => {
    setProductLoading(true)

    const backendParams = new URLSearchParams();

    backendParams.set("page", urlPage);
    if (urlCategory) backendParams.set("categoryID", urlCategory);
    if (minuumPrice) backendParams.set("minPrice", minuumPrice);
    if (maxiumPrice) backendParams.set("maxPrice", maxiumPrice);
    if (urlOrder) backendParams.set("mino", urlOrder);
    try {
      let url = `https://e-commerce-v2-hts6.vercel.app/api/product/categori/${selectedCatId}?${backendParams.toString()}`;

      await fetchProducts(url);

    } catch (error) {
      alert("Ett oväntat fel har inträffat. Försök igen.")
    } finally {
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

