import express from "express";

import { isModeratorAuth } from "../middlewares/Auth.js";
import {
  addModeratorProduct,
  deleteProductsByModerator,
  getAllProductsByModerator,
  getOneProductData,
  UpdateProductsDetailsByModerator,
} from "../controllers/moderatorControllers.js";

const route = express.Router();

route.post("/add-product", isModeratorAuth, addModeratorProduct);
route.get("/get-all-product", isModeratorAuth, getAllProductsByModerator);
route.get("/get-one/:id", isModeratorAuth, getOneProductData);
route.delete("/delete/:id", isModeratorAuth, deleteProductsByModerator);
route.put("/update/:id", isModeratorAuth, UpdateProductsDetailsByModerator);

//

export default route;
