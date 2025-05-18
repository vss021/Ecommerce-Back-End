import mongoose from "mongoose";


const userModel = new mongoose.Schema({
    email : {
        type : String,
        unique: true,
        trim: true,
        index: true,  // faster queries on email
        required : true,
    },
    password : {
        type : String,
        required : true,
        select: false, // don't return password by default
    },
    phoneNumber : {
        type : Number,
        required : true,
    },
    fullName : {
        type : String,
    },
    address : {
        type : String,
    },

    role : {
        type : String,
        enum : ["user", "admin", "moderator"],
        default : 'user',
    },

    status : {
        type : String,
        enum : ["active", "inactive", "banned", "pending"],
        default : "pending",
    },


    resetPasswordToken: String,

    resetPasswordExpires: Date,

    emailVerificationToken: String,
    
    emailVerified: {
      type: Boolean,
      default: false,
    },


    
},
{ timestamps: true });

const USER = mongoose.model("USER", userModel);

export default USER;