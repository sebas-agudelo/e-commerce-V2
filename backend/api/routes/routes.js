import express from 'express';
import { checkUserSession, signIn, signOut, authMiddleware, profile, updateUserData, addUserInfo } from '../controllers/auth/authService.js'
import { addToCart, updateCartQty, showCart } from '../controllers/cart/addToCartCtrl.js';
import { customerAuthOrders, customerOrders, getUserOrderDetails, getUserOrderSummaries, validateCheckoutCustomerData } from '../controllers/orders/ordersCtrl.js';
import { stripeCheckOut } from '../controllers/stripe/checkOut.js';
import { categories, getProductByID, getProducts, searchProduct, productByCategory, getSuperDealsProducts } from '../controllers/products/productsCtrl.js';

export const routes = express.Router();

/* ALL AUTH ROUTES */
routes.post('/auth/signin', signIn);
routes.post('/auth/signout', signOut);
routes.get('/auth/profile', authMiddleware, profile); 
routes.get('/auth/checkUserSession', checkUserSession);
routes.put('/auth/user/update', authMiddleware, updateUserData);
routes.post('/auth/user/add-info', authMiddleware, addUserInfo);

/* ALL PRODUCTS ROUTES */
routes.get('/api/products/show', getProducts);
routes.get('/api/product/get/:id', getProductByID);
routes.get('/api/categori/get', categories)
routes.get('/search', searchProduct);
routes.get('/api/product/categori/:selectedCatId', productByCategory);
routes.get('/superdeals', getSuperDealsProducts)

/* ALL CART ROUTES */
routes.post('/api/cart/addtocart', authMiddleware, addToCart);
routes.put('/api/cart/update', authMiddleware, updateCartQty);
routes.get('/api/cart/show', authMiddleware, showCart);
routes.post('/api/order/insert', authMiddleware, customerAuthOrders);
routes.post('/api/order/guestorder', customerOrders);
routes.post('/api/user/validation', validateCheckoutCustomerData);
routes.get('/api/order/myorders',authMiddleware, getUserOrderSummaries);
routes.get('/api/order/details/:order_id',authMiddleware, getUserOrderDetails);


/* STRIPE ROUTE */
routes.post('/create-payment-intent', stripeCheckOut);
