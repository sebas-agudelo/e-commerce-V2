import { useState } from "react";

export default function ProductStates() {
     const [productData, setProductData] = useState({
        title: "",
        price: "",
        category_id: "",
        category_name: "",
        description: "",
        brand: "",
        connection_type: "",
        charging_time: "",
        battery_life: "",
        garanti: "",
        img: null,
      });
  return [
    productData, 
    setProductData
  ]
}
