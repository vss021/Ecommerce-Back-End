import express from "express";
import { isModeratorAuth } from "../middlewares/Auth.js";

import {
  getModeratorAllProductsOrders,
  getModeratorEarningsAndRefunds,
  updateModeratorOrderItemStatus,
} from "../controllers/moderatorAllProductsOrdersControllers.js";

const route = express.Router();

route.get("/get-all", isModeratorAuth, getModeratorAllProductsOrders);
route.get("/monitor", isModeratorAuth, getModeratorEarningsAndRefunds);
route.put("/monitor", isModeratorAuth, updateModeratorOrderItemStatus);

export default route;
