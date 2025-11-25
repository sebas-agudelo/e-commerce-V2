import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const location = useLocation();
  const [okmessage, setOkMessage] = useState("");
  const [Errormessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setErrorMessage("");
    setOkMessage("");
  }, [location]);

  const fetchProductById = async (id) => {
    setIsLoading(true);
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
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      alert("Ett oväntat fel har inträffat. Försök igen.");
    } finally {
      setIsLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const response = await fetch(
        `https://e-commerce-v2-hts6.vercel.app/api/categori/get`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCategories(data.data);
      }
    } catch (error) {
      alert("Ett oväntat fel har inträffat. Försök igen.");
    }
  };

  return (
    <ProductContext.Provider
      value={{
        productData,
        Errormessage,
        okmessage,
        categories,
        setProductData,
        setErrorMessage,
        setOkMessage,
        getCategories,
        fetchProductById,
        setCategories,
        isLoading
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
