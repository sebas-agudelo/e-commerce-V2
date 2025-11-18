import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import { AuthSessionContext } from "../../Context/SessionProvider";
import { ProductContext } from "../../Context/ProductContext";
import ShowCartItems from "../../components/CartComponent/ShowCartItems";
import Footer from "../Footer";
import CartRemoveProductConfirm from "../../components/CartComponent/CartRemoveProductConfirm";

export default function Cart() {
  const { cartItems, setCartItems, total, showCart, updateCartQty, setTotal, setSaleTotalPrice } =
    useContext(CartContext);
  const { session } = useContext(AuthSessionContext);
  const { fetchProductById } = useContext(ProductContext);
  const [showDelMessage, setShowDelMessage] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const { id } = useParams();

  console.log(id);
  

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [setCartItems, id]);

   useEffect(() => {
  const loadCart = async () => {
        if(session === undefined) return; 
    await showCart();
  };

  loadCart();
}, [session]);

  const handleConfirmDelete = () => {
    if (!productToDelete) {
      return;
    };

    const updatedCart = cartItems.filter(
      (p) => p.product_id !== productToDelete.product_id
    );

    setCartItems(updatedCart);

    let newTotal = 0;
    let newsalePriceSum = 0;
    updatedCart.forEach((p) => {
      if (p.sale_unit_price) {
        newTotal += p.quantity * p.sale_unit_price
      } else if (p.unit_price) {
        newTotal += p.quantity * p.unit_price;
      }


      if (p.sale_unit_price) {
        let unitDiscount = p.unit_price - p.sale_unit_price || 0;
        newsalePriceSum += unitDiscount * p.quantity || 0;
      }
    });
    setTotal(newTotal);
    setSaleTotalPrice(newsalePriceSum)

    if (session === null) {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      updateCartQty(productToDelete.product_id, 0);
    }

    setShowDelMessage(false);
    setProductToDelete(null);
  };


  const handleCancelDeleteProduct = () => {
    setShowDelMessage(false);
    setProductToDelete(null);
  };

  const incruseQty = (item) => {
    if (!item) {
      return;
    }

    const newQty = item.quantity + 1;
    let totalPrice = 0;

    if (item.sale_unit_price) {
      totalPrice = item.sale_unit_price * newQty;

    } else {
      totalPrice = item.unit_price * newQty;
    }

    const updatedCart = cartItems.map((items) => {
      if (items.product_id === item.product_id) {
        return {
          ...items,
          quantity: newQty,
          total_price: totalPrice,
        };
      } else {
        return items;
      }
    });

    let newTotal = 0;
    let newsalePriceSum = 0;


    updatedCart.forEach((p) => {
      if (p.sale_unit_price) {
        newTotal += p.quantity * p.sale_unit_price
      } else {
        newTotal += p.quantity * p.unit_price;
      }

      if (p.sale_unit_price) {
        let unitDiscount = p.unit_price - p.sale_unit_price;
        newsalePriceSum += unitDiscount * p.quantity
      }
    });

    setTotal(newTotal);
    setCartItems(updatedCart);
    setSaleTotalPrice(newsalePriceSum)

    if (session === null) {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      updateCartQty(item.product_id, newQty);
    }
  };

  const reduceQty = (item) => {
    if (!item) {
      return;
    }
    const newQty = item.quantity - 1;
    let totalPrice = 0;

    if (item.sale_unit_price) {
      totalPrice = item.sale_unit_price * newQty;

    } else {
      totalPrice = item.unit_price * newQty;
    }

    if (newQty === 0) {
      setShowDelMessage(true);
      setProductToDelete(item);
      return;
    }

    const updatedCart = cartItems.map((items) => {
      if (items.product_id === item.product_id) {
        return {
          ...items,
          quantity: newQty,
          total_price: totalPrice,
        };
      } else {
        return items;
      }
    });

    setCartItems(updatedCart);

    let newTotal = 0;
    let newsalePriceSum = 0;

    updatedCart.forEach((p) => {
      if (p.sale_unit_price) {
        newTotal += p.quantity * p.sale_unit_price;

      } else {
        newTotal += p.quantity * p.unit_price;

      }

      if (p.sale_unit_price) {
        let unitDiscount = p.unit_price - p.sale_unit_price;
        newsalePriceSum += unitDiscount * p.quantity
      }
    });

    console.info("Pris efter att tagit bort en produkt: ", newsalePriceSum)

    setTotal(newTotal);
    setSaleTotalPrice(newsalePriceSum)


    if (session === null) {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else if (session) {
      updateCartQty(item.product_id, newQty);
    }
  };

  return (
    <main className="cart-container">
        <h2 className="shopping-cart">VAROKORG</h2>
      <section>
        <ShowCartItems reduceQty={reduceQty} incruseQty={incruseQty} />
        {showDelMessage ? (
          <CartRemoveProductConfirm
            onDelete={handleConfirmDelete}
            onCancel={handleCancelDeleteProduct}
          />
        ) : (
          ""
        )}
      </section>
      <Footer />
    </main>
  );
}
