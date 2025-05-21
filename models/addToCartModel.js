import mongoose from "mongoose";


const productItemSchema = new mongoose.Schema({
    productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PRODUCTS",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  }
}, {_id : false}); // Prevents Mongoose from creating an _id for each item


const AddToCartSchem = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "USER",
        required : true,
    },

    cartItems : [productItemSchema],
}, {timestamps : true});


const ADDTOCARTMODEL = mongoose.model("ADDTOCARTMODEL", AddToCartSchem);

export default ADDTOCARTMODEL;