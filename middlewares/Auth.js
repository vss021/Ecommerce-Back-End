import USER from "../models/userModel.js";
import ErrorHandler from "./ErrorHandler.js";
import jwt from "jsonwebtoken";

export const isUserAuthenticated = async (req, res, next) => {
  try {
    // Get token from cookies
    const { token } = req.cookies;


    if (!token) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    const user = await USER.findById(decoded.id);
    // console.log("User is : "+ user);

    if (!user) {
      return next(new ErrorHandler("User does not exist", 401));
    }

    req.user = user;
    // console.log(req.user);
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token. Please log in again.", 401));
  }
};

export const isModeratorAuth = async(req, res, next) => {
  try {

    // Get token from cookies
    const { token } = req.cookies;


    if (!token) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    const user = await USER.findById(decoded.id);

    if(user.role !== "moderator"){
      return next( new ErrorHandler("Access forbidden! ", 404));
    }

    req.user = user;

    // next
    // console.log("moderator User : ", req.user);
    next();
  } catch (error) {
     return next(new ErrorHandler("Invalid token. Please log in again.", 401));
  }
};

export const isAdminAuth = async(req, res, next) => {
  try {

    // Get token from cookies
    const { token } = req.cookies;


    if (!token) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    const user = await USER.findById(decoded.id);

    if(user.role !== "admin"){
      return next( new ErrorHandler("Access forbidden! ", 404));
    }

    req.user = user;
    // console.log(req.user);
    // next
    next();
  } catch (error) {
     return next(new ErrorHandler("Invalid token. Please log in again.", 401));
  }
};
