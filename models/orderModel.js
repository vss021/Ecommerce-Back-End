import mongoose from "mongoose";

// sub-schema

const orderItemSchema  = new mongoose.Schema({

    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "PRODUCTS",
        required : true,
        unique : true,
    },
    quantity : {
        type : Numeber,
        required : true,
        min : 1,
    },
    priceAtPurchase : {
        type : Number,
        required : true,
    }
}, {_id : false});


// orignal Schema

const orderSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "USER",
        required : true,
        unique : true,
    },
    purchaseItems : [
        {orderItemSchema}
    ],

    totalAmount : {
        type : Number,
        required : true,
    },

    shippingAddress : {
        name : {
            type : String,
            required : true,
        },
        Phone : {
            type : String,
            required : true,
        },
        addressLine1 : {
            type : String,
            required : true,
        },
        addressLine2 : {
            type : String,
        },
        city : {
            type : String,
            required : true,
        },
        state : {
            type : String,
            required : true,
        },

        postalCode : {
            type : String,
            required : true,
        },
        country : {
            type : String,
            required : true,
        },
    },
    paymentStatus : {
        type : String,
        enum : ["pending", "online", "faild", "refunded"],
        default : "pending"
    },
    orderStatus : {
        type : String,
        enum : ["processing", "shipped", "delivered", "cancelled"],
        default : "processing",
    },
    paymentMethod : {
        type : String,
        enum: ["card", "upi", "cod", "netbanking"],
        required: true,
    },
    placedAt: {
        type: Date,
        default: Date.now,
    },

    deliveredAt: {
        type: Date,
    },
}, {timestamps : true});

const ORDERMODEL = mongoose.model("ORDERMODEL", orderSchema);

export default ORDERMODEL;