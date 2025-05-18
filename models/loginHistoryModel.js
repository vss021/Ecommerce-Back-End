import mongoose from "mongoose";
import USER from "./userModel.js";

const loginHistorySchema = new mongoose.Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "USER",
        required : true,
    },

    loginAt : {
        type : Date,
        default : Date.now(),
    },

    ipAddress : String, 
    userAgent : String, // piece of text that identifies the browser, operating system, 
    Device : String,
});

const HISTORYMODEL = mongoose.model(HISTORYMODEL, loginHistorySchema);

export default HISTORYMODEL;