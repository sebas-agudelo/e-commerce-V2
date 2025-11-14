import express from 'express';
import { sessionAuthCheck, signIn, signOut, authenticateUser, profile, updateUserData, addUserInfo } from '../controllers/auth/sessionManagement.js'
import { addToCart, updateCartQty, showCart } from '../controllers/cart/addToCartCtrl.js';
import { customerAuthOrders, customerOrders, getUserOrderDetails, getUserOrderSummaries, validateCheckoutUserData } from '../controllers/orders/ordersCtrl.js';
import { stripeCheckOut } from '../controllers/stripe/checkOut.js';
import { categories, getProductByID, getProducts, searchProduct, productByCategory, getSuperDealsProducts } from '../controllers/products/productsCtrl.js';

export const routes = express.Router();

/* ALL AUTH ROUTES */
routes.post('/auth/signin', signIn);
routes.post('/auth/signout', signOut);
routes.get('/auth/profile', authenticateUser, profile); 
routes.get('/auth/sessionAuthCheck', sessionAuthCheck);
routes.put('/auth/user/update', authenticateUser, updateUserData);
routes.post('/auth/user/add-info', authenticateUser, addUserInfo);

/* ALL PRODUCTS ROUTES */
routes.get('/api/products/show', getProducts);
routes.get('/api/product/get/:id', getProductByID);
routes.get('/api/categori/get', categories)
routes.get('/search', searchProduct);
routes.get('/api/product/categori/:selectedCatId', productByCategory);
routes.get('/superdeals', getSuperDealsProducts)
/* ALL CART ROUTES */
routes.post('/api/cart/addtocart', authenticateUser, addToCart);
routes.put('/api/cart/update', authenticateUser, updateCartQty);
routes.get('/api/cart/show', authenticateUser, showCart);
routes.post('/api/order/insert', authenticateUser, customerAuthOrders);
routes.post('/api/order/guestorder', customerOrders);
routes.post('/api/user/validation', validateCheckoutUserData);
routes.get('/api/order/myorders',authenticateUser, getUserOrderSummaries);
routes.get('/api/order/details/:order_id',authenticateUser, getUserOrderDetails);


/* STRIPE ROUTE */
routes.post('/create-payment-intent', stripeCheckOut);
