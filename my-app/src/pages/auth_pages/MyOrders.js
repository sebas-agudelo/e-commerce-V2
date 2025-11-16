import { useEffect, useState } from "react";
import ContentSpinner from "../../components/spinners/ContentSpinner";
import { CgArrowRight } from "react-icons/cg";

import { Link } from "react-router-dom";
import UserProfileActions from "../../components/ProfileComponent/UserProfileActions";

export default function MyOrders() {
  const [orders, setOrders] = useState();
  const [loading, setLoading] = useState(true);
  const [seMore, setSeMore] = useState({});
  const [width, setWidth] = useState(window.innerWidth >= 768);
  
 useEffect(() => {
    setWidth(window.innerWidth >= 768);
  }, [width]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://e-commerce-v2-hts6.vercel.app/api/order/myorders`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setOrders(data);
          console.log(data);
        }

        setLoading(false);
      } catch (error) {
        alert("Ett oväntat fel har inträffat. Försök igen.");
      }
    };

    fetchOrders();
  }, []);

  const showOrderItems = (order_id) => {
    setSeMore((s) => ({
      ...s,
      [order_id]: !s[order_id]
    }));
  };

  return (
    <div className="profile-container">
      <h1>MINA BESTÄLLNINGAR</h1>
      {width && <UserProfileActions />}
    <div className="my-orders-container">
      {loading ? (
        <ContentSpinner />
      ) : (
        <>
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <div className="orders-content" key={order.id}>
                <div className="order-info">
                  <p>
                    <span id="order_id">Beställningsnummer</span>{order.id}
                  </p>
                  <p>
                    <span>Beställningsdatum</span>{order.created_at.split("T")[0]} {order.created_at.split("T")[1].split(".")[0]} 
                  </p>
                  <p>
                    <span>Betalningstatus</span>{order.payment_status}
                  </p>
                  <p>
                    <span>Totalsumma</span>{order.total_amount},00kr.
                  </p>
                </div>

                <div id="viewOrder"><Link to={`/profile/orders/details/order/${order.id}`}>Se beställning <CgArrowRight /></Link></div>
              </div>
            ))
          ) : (
            <div>
              <h3>Inga köp att visa just nu</h3>
              <p>När du har köpt något online hittar du det här.</p>
            </div>
          )}
        </>
      )}
    </div>
    </div>
  );
}
