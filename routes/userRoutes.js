import express from "express";
import { isUserAuthenticated } from "../middlewares/Auth.js";
import {
  getUserData,
  logoutAccount,
  signIn,
  signUp,
  updateProfile,
} from "../controllers/userControllers.js";

const route = express.Router();


// ************** Common Routes for all  **************

route.post("/signup", signUp);

route.post("/signin", signIn); 

route.get("/logout", isUserAuthenticated, logoutAccount);

route.get("/getuser", isUserAuthenticated, getUserData);

route.post("/update", isUserAuthenticated, updateProfile);


// ********** User Router ************


/**
 * PATCH /api/cart/update-quantity/:id
Content-Type: application/json

{
  "action": "increase" // or "decrease"
}

 * 
 */

// **********Order Items


export default route;
