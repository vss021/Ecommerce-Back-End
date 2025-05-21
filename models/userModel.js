import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userModel = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      index: true, // faster queries on email
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // don't return password by default
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    fullName: {
      type: String,
    },
    avater: {
      url: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/219/219983.png",
      },
      public_id: {
        type: String,
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    address: {
      type: String,
    },

    likeCount: {
      type: Number,
      default: 0,
    },

    cartInfo : {
      addCartId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "CARTMODEL",
      },
      cartItemCount :{
        type : Number,
        default: 0,
      }
    },

    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "banned", "pending"],
      default: "pending",
    },


    resetPasswordToken: String,

    resetPasswordExpires: Date,

    emailVerificationToken: String,

    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Pre Save User

userModel.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare Password
userModel.methods.comparePassword = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

userModel.methods.generateJsonWebToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, 
  { expiresIn: `${process.env.JWT_EXPIRES}d` },);
};

// Generating Reset password Toke

userModel.methods.getResetPasswordToken = function () {
  // Generate Token

  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding Reset Password Token To UserModel

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Setting Reset Password Token Expiry Time
  this.resetPasswordExpires = Date.now() + 3600000;

  return resetToken;
};

const USER = mongoose.model("USER", userModel);
export default USER;
