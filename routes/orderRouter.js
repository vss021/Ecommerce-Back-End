import express from "express";
import { isUserAuthenticated } from "../middlewares/Auth.js";
import { cancelOrder, createOrderProducts, getMyOrder, getOrderDetails } from "../controllers/userOrderController.js";

const route = express.Router();


route.put("/user", isUserAuthenticated, createOrderProducts);
route.get("/get/:id", isUserAuthenticated, getMyOrder);
route.get("/get/all/:id", isUserAuthenticated, getOrderDetails);
route.put("/cancle/:id", isUserAuthenticated, cancelOrder);



export default route;