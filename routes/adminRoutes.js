import express from "express";
import { isAdminAuth } from "../middlewares/Auth.js";
import {
  deleteAnyProduct,
  deleteUserAccount,
  getAllOrders,
  getAllProducts,
  GetAllUsers,
  getProductDetails,
  getSiteStats,
  updateUserRole,
  updateAnyProduct,
  addNewProduct,

} from "../controllers/adminControllers.js";

const route = express.Router();

route.get("/users", isAdminAuth, GetAllUsers);

route.put("/users/:id", isAdminAuth, updateUserRole);

// Delete a user account
route.delete("/user/:id", isAdminAuth, deleteUserAccount);

// get all oders
route.get("/orders", isAdminAuth, getAllOrders);

route.put("/order/:orderId/status", isAdminAuth, getAllOrders);

route.get("/start", isAdminAuth, getSiteStats);

route.get("/products", isAdminAuth, getAllProducts);

route.get("/product/:productId", isAdminAuth, getProductDetails);

route.delete("/product/:productId", isAdminAuth, deleteAnyProduct);

route.put("/product/update", isAdminAuth, updateAnyProduct);

route.post("/product/add", isAdminAuth, addNewProduct);

export default route;
