import "./scss/main.scss";
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/nav/Navbar";
import Contact from "./pages/Contact";
import About from "./pages/About";
import { ProductProvider } from "./Context/ProductContext";
import { CartProvider } from "./Context/CartContext";
import SignIn from "./pages/auth_pages/SignIn";
import ProductDetails from "./pages/product_pages/ProductDetails";
import ProductSearch from "./pages/product_pages/Search";
import ProtectedRoutes from "./protected/ProtectedRoutes";
import RedirectedRoutes from "./protected/RedirectedRoutes";
import Spinners from "./components/spinners/Spinners";
import Success from "./pages/Success";
import { ProductsProvider } from "./Context/ProductsContext";
import MyOrders from "./pages/auth_pages/MyOrders";
import MyData from "./pages/auth_pages/MyData";
import Account from "./pages/auth_pages/Account";
import PageNotFound from "./pages/PageNotFound";
import OrderDetails from "./pages/auth_pages/OrderDetails";

const Home = React.lazy(() => import("./pages/Home"));
const AllProducts = React.lazy(() =>
  import("./pages/product_pages/AllProducts")
);
const CheckOut = React.lazy(() =>
  import("./pages/cart_payment_pages/CheckOut")
);
const Profile = React.lazy(() => import("./pages/auth_pages/Profile"));
const Cart = React.lazy(() => import("./pages/cart_payment_pages/Cart"));
const ProductsByCategory = React.lazy(() =>
  import("./pages/product_pages/ProductsByCategory")
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ProductProvider>
          <CartProvider>
            <ProductsProvider>
              <Navbar />
              <Suspense fallback={<Spinners />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route
                    path="/products/:selectedCatId/cat/:category"
                    element={<ProductsByCategory />}
                  />
                  <Route path="/search" element={<ProductSearch />} />

                  {/* CART PAGES */}
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<CheckOut />} />

                  {/* PRODUCT PAGES */}
                  {/* <Route path="/products" element={<AllProducts />} /> */}
                  <Route path="/product/:id" element={<ProductDetails />} />

                  {/* AUTH PAGES */}
                  <Route
                    path="/signin"
                    element={
                      <RedirectedRoutes>
                        <SignIn />
                      </RedirectedRoutes>
                    }
                  />
                  <Route
                    path="/profile/account"
                    element={
                      <ProtectedRoutes>
                        <Account />
                      </ProtectedRoutes>
                    }
                  />
                  <Route
                    path="/profile/account/mydata"
                    element={
                      <ProtectedRoutes>
                        <MyData />
                      </ProtectedRoutes>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoutes>
                        <Profile />
                      </ProtectedRoutes>
                    }
                  />
                  <Route path="/payment-success" element={<Success />} />
                  <Route path="/search?query" />
                  {/* <Route path="/filtred/byPrice?query"/> */}
                  {/* <Route 
                      path="/dashboard" element={<Dashboard />}
                      /> */}
                  <Route
                    path="/myorders"
                    element={
                      <ProtectedRoutes>
                        <MyOrders />
                      </ProtectedRoutes>
                    }
                  />

                  <Route path="*" element={<PageNotFound />} />

                  <Route path="/products" element={<AllProducts />} />
                  <Route
                    path="/profile/orders/details/order/:order_id"
                    element={<OrderDetails />}
                  />
                </Routes>
              </Suspense>
            </ProductsProvider>
          </CartProvider>
        </ProductProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
