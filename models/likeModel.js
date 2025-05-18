import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "USER",
        unique : true,
        required : true,
    },

    products : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "PRODUCTS",
            unique : true,
            required : true,
        }],
}, {timestamps : true});

const LIKEMODEL = mongoose.model("LIKEMODEL", likeSchema);

export default LIKEMODEL;