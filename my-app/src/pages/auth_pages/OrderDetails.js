import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ContentSpinner from "../../components/spinners/ContentSpinner";
import { ProductContext } from "../../Context/ProductContext";

export default function OrderDetails() {
  const { order_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState();
  const {fetchProductById} = useContext(ProductContext)
  
  useEffect(() => {
    fetOrderDetails();
    fetchProductById()
  }, []);

  const fetOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        // https://examensarbeten.vercel.app/api/order/details/${order_id}
        `http://localhost:3030/api/order/details/${order_id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      console.log("Detalles de la orden: ",data);
      

      if (!response.ok) {
        alert(data.error);
        return;
      }
      setOrders(data);

      console.log(data);

      setLoading(false);
    } catch (error) {
      alert("Ett oväntat fel har inträffat. Försök igen.");
    }
  };

  return (
    <div
    className="order-details-container"
      style={{
        paddingTop: "80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>BESTÄLLNING</h1>
      {loading ? (
        <ContentSpinner />
      ) : (
        <>
          {orders &&
            orders.map((order) => (
              <div className="order-content" key={order.id}>
                <div className="order-info">
                  <p>
                    <span id="order_id">Beställningsnummer</span>
                    {order.id}
                  </p>
                  <p>
                    <span>Beställningsdatum</span>
                    {order.created_at.split("T")[0]} {order.created_at.split("T")[1].split(".")[0]}
                  </p>
                  <p>
                    <span>Betalningstatus</span>
                    {order.payment_status}
                  </p>
                  <p> <span>Du sparade</span> {order.totalDiscountSum}.00 kr.</p>
                  <p>
                    <span>Totalsumma</span>
                    {order.total_amount},00kr.
                  </p>
                </div>

            <div className="order-items-wrapper">
                <h3>Produkter</h3>
                {order.items_order &&
                  order.items_order.map((item) => (
                    <div className="order-item" key={item.id}>
                      <p><Link to={`/product/${item.product_id}`}>{item.product_title}</Link></p>
                      <p>
                        <span>Antal</span>: {item.quantity}
                      </p>
                      {item.sale_unit_price ? 
                      <>
                      <p><span>Rabattpris: </span> {item.sale_unit_price}.00 kr.</p>
                      <p><span>Pris:</span> {item.unit_price}.00 kr.</p>
                      </>

                      :

                     <p><span>Pris:</span> {item.unit_price}.00 kr.</p>
                      }
                    </div>
                  ))}
              </div>
            </div>
            ))}
        </>
      )}
    </div>
  );
}
