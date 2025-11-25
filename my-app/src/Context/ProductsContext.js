import { createContext, useState } from "react";

export const ProductsApiContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [pages, setPages] = useState(1); 
  const [count, setCount] = useState(0); 
  const [currenPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState(0);
  const [livePrice, setLivePrice] = useState(0);
  const [categoryID, setCategoryID] = useState("");
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [invalidCategory, setInvalidCategory] = useState(false);
  const [invalidFilter, setInvalidFilter] = useState(false);
  const [productLoading, setProductLoading] = useState(false);

  const fetchProducts = async (url) => {
    
    try {
      const response = await fetch(url);
      const data = await response.json();          
      
      if (response.ok) {
          setPages(data.totalPages || 1);
          setCount(data.count || 0);
          setCurrentPage(data.currenPage || 1)
          setProducts(data.products);
          setInvalidCategory(false)
          setInvalidFilter(false)
    }
    if(!response.ok){
      if(data.reason === "INVALID_CATEGORY"){
        setInvalidCategory(true)
        return;
      }

      setMessage(data.error);
      setPages(data.totalPages || 0);
      setCount(data.count || 0);
      setCurrentPage(data.currenPage || 0);  
      setProducts(data.products || []);
      setInvalidFilter(true)
    }
    } catch (error) {
      alert("Ett oväntat fel har inträffat. Försök igen");
    }
  };
  return (
    <ProductsApiContext.Provider
      value={{
        fetchProducts,
        setPages,
        pages,
        setCount,
        count,
        setCurrentPage,
        currenPage, 
        setPrice,
        price,
        livePrice,
        setLivePrice,
        setCategoryID,
        categoryID,
        setProducts,
        products,
        setMessage,
        message,
        invalidCategory,
        invalidFilter,
        setProductLoading,
        productLoading
      }}
    >
      {children}
    </ProductsApiContext.Provider>
  );
};
