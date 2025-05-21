import express from 'express';
import { isUserAuthenticated } from '../middlewares/Auth.js';
import { addToCartProduct, LikeProducts, removeFromCartProduct, updateCartQuantity } from '../controllers/cartController.js';

const route = express.Router();

route.put("/add-like/:id", isUserAuthenticated, LikeProducts);

route.put("/add-cart/:id", isUserAuthenticated, addToCartProduct);

route.put("/remove-item/:id", isUserAuthenticated, removeFromCartProduct);

route.put("/update-item/:id", isUserAuthenticated, updateCartQuantity);

export default route;