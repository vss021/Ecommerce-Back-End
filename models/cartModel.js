import mongoose from "mongoose";


const CartSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "USER",
    },
    
    cartAddedProducts: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PRODUCTMODEL",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      }
    }
  ]

});

const CARTMODEL = mongoose.model("CARTMODEL", CartSchema);

export default CARTMODEL;