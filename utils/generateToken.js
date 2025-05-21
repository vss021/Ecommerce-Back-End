import ErrorHandler from "../middlewares/ErrorHandler.js";



export const generateToken = async (user, message, statusCode, res) => {

  try {
    const token =  await user.generateJsonWebToken();
    // console.log("Generated Token:", token);
    // console.log("Token type:", typeof token);
    res
      .status(statusCode)
      .cookie("token", token, {
        expires: new Date(
          Date.now() + process.env.JWT_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      })
      .json({
        success: true,
        message,
        user,
        token,
      });
  } catch (error) {
    console.log("Error from Generate token : " + error.message);
    return new ErrorHandler("Token generation failed.", 500);
  }
};
