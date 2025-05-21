import bcrypt from "bcrypt";
import USER from "../models/userModel.js";
import { cloudinaryFileUploader } from "../utils/cloudinaryImgUploader.js";
import ErrorHandler from "../middlewares/ErrorHandler.js";
import { generateToken } from "../utils/generateToken.js";
import PRODUCTMODEL from "../models/productsModel.js";
import CARTMODEL from "../models/cartModel.js";



/** *   Common Controllers */

export const signUp = async (req, res, next) => {

  try {
    const { email, password, phone } = req.body;

    // ✅ Check for required fields
    if (!email || !password || !phone) {
      // Return a 400 Bad Request response with custom error handler
      return ErrorHandler("All fields are required ", 400);
    }

    const checkForEmial = await USER.findOne({ email });

    if (checkForEmial) {
      return next(new ErrorHandler("Email Already Exist!", 409));
    }

    

    // ✅ Create a new user in the database
    const user = await USER.create({
      email,
      password,
      phoneNumber: phone,
    });

    // ✅ Send success response
    generateToken(user, "Registered!", 201, res);
    // return res.status(201).json({
    //   success: true,
    //   user,
    // });
  
  } catch (error) {
    console.error("Error during sign up:", error.message);
    // ✅ Send error response
    return next(new ErrorHandler("Server error. Please try again later.", 500));
  }
};


export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("All Field Required", 400));
    }

    const userExist = await USER.findOne({ email }).select("+password"); // remove password in this

    if (!userExist) {
      return next(new ErrorHandler("User Not Found", 404));
    }

    const validPassword = await userExist.comparePassword(password);

    if (!validPassword) {
      return next(new ErrorHandler("Invalid Email Or Password", 401));
    }

    userExist.password = undefined; // client site pas = undifined
    generateToken(userExist, "Login Successfully!", 200, res);
  } catch (error) {
    console.log("Error in SignIn", error.message);
    return next(new ErrorHandler("Server error. Please try again later.", 500));
  }
};

export const logoutAccount = async (req, res, next) => {
  res
  .status(200)
  .cookie("token", "", {
    httpOnly : true,
    expires : new Date(Date.now()),
  })
  .json({
    success : true,
    message : "Logged Out!",
  });
};

export const getUserData = async(req, res, next) => {
  try {

    const _id = req.user._id;

    if(!_id){
       return next( new ErrorHandler("Login Again!", 401));
    }

    const useData = await USER.findById({_id});

    useData.password = undefined;

    res.status(201)
    .json({
      success : true,
      useData,
    });
  } catch (error) {
      console.log("Error in getUserData!  -> ", error.message);
      return next( new ErrorHandler("Try Again some time later! ", 500));
  }
}

export const updateProfile = async(req, res, next) => {
  try {

    const {_id} = req.body;

    const { fullName, phoneNumber, gender, address, email } = req.body;

    const newUserData = {
      fullName,
      phoneNumber,
      gender,
      address,
      email,
      status : "active",
    }

    console.log("New User Data  :", newUserData);
    
    if(!fullName || !phoneNumber || !address || !gender ) {
      return next( new ErrorHandler("All Field Required!", 401));
    }


    // uploading image
    if(req.body.avater || req.files){

      const ImageData  = await cloudinaryFileUploader(avater, `${fullName+" "} Image`);
      newUserData.avater = {
        public_id : ImageData.public_id,
        url : ImageData.secure_url,
      };
    }

    // Finaly data Upload to Db

  const user = await USER.findByIdAndUpdate(req.user._id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(201).json({
      success : true,
      message : "Profile Updated",
      user,
    });

  } catch (error) {
    console.log("Error in Profile Uplaod  ->  "+ error.message);
    return next(new ErrorHandler("Server Error!", 500));
}};








