import USER from "../models/userModel.js";
import ErrorHandler from "../middlewares/ErrorHandler.js";
import bcrypt  from "bcrypt"

export const signUp = async (req, res, next) => {
  try {
    const { email, password, phone } = req.body;

    // ✅ Check for required fields
    if (!email || !password || !phone) {
      // Return a 400 Bad Request response with custom error handler
      return ErrorHandler("All fields are required ", 400);
    }

    const checkForEmial = await USER.findOne({email});

    if(checkForEmial){
        return next(new ErrorHandler("Email Already Exist!", 409));
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // ✅ Create a new user in the database
    const user = await USER.create({
      email,
      password : hashPassword,
      phoneNumber: phone
    });


    // ✅ Send success response
    return res.status(201).json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Error during sign up:", error.message);
    // ✅ Send error response
    return next(new ErrorHandler("Server error. Please try again later.", 500));
    
}
};

export const signIn = async( req, res, next) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return next(new ErrorHandler("All Field Required", 400));
        }
        
        const userExist = await USER.findOne({email});
        
        if(!userExist){
            return next(new ErrorHandler("User Not Found", 404));
        }
        
        const validPassword = await bcrypt.compare(password, userExist.password);

        if(!validPassword){
            return next(new ErrorHandler("Invalid Password", 404));
        }
        
        return res.status(201).json({
            userExist,
            success : true,
        });
    } catch (error) {
        console.log("Error in SignIn", error.message);
        return next(new ErrorHandler("Server error. Please try again later.", 500));
    }
}
