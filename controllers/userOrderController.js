import CARTMODEL from "../models/cartModel.js";
import USER from "../models/userModel.js";
import ORDERMODEL from "../models/orderModel.js";
import ErrorHandler from "../middlewares/ErrorHandler.js";

export const createOrderProducts = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { shippingAddress, paymentMethod } = req.body;

    

    if (!shippingAddress || !paymentMethod) {
      return next(
        new ErrorHandler("Shipping address and payment method required", 400)
      );
    }

    // Get user's cart
   const cart = await CARTMODEL.findOne({ userId }).populate({
      path: "cartAddedProducts",
      populate: {
        path: "productId",
      },
    });
    
    // console.log(JSON.stringify(cart, null, 2));

    if (!cart || cart.cartAddedProducts.length === 0) {
      return next(new ErrorHandler("Cart is empty", 400));
    }
    // Build order items
    // let totalAmount = 0;
    // const orderItems = [];

    // for (const product of cart.cartAddedProducts) {
    //   const quantity = product.quantity; // default to 1, unless quantity tracking is implemented
    //   const priceAtPurchase = product.price;

    //   totalAmount += priceAtPurchase * quantity;

    //   orderItems.push({
    //     productId: product._id,
    //     quantity,
    //     priceAtPurchase,
    //   });
    // }

  let totalAmount = 0;
  const orderItems = [];

for (const item of cart.cartAddedProducts) {
  const quantity = item.quantity;

  const product = item.productId;
  const originalPrice = product.price;
  const discountPercentage = product.discountPercentage || 0;
  const discountPrice = Math.round((originalPrice * discountPercentage) / 100); 
  const priceAtPurchase = Math.round(
    originalPrice - (originalPrice * discountPercentage) / 100
  );

  totalAmount += priceAtPurchase * quantity;

  orderItems.push({
    productId: product._id,
    quantity,
    priceAtPurchase,  // discounted price
    discountPrice
  });
}

    // Create new order
    const newOrder = new ORDERMODEL({
      userId,
      purchaseItems: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    await newOrder.save();

    // Clear cart
    cart.cartAddedProducts = [];
    await cart.save();

    // Update user's cart count
    const user = await USER.findById(userId);
    if (user && user.cartInfo) {
      user.cartInfo.cartItemCount = 0;
      await user.save();
    }
    console.log("orderItems", orderItems);

    return res.status(201).json({
      success: true,
      message: "Order Will placed to You",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error in orderProducts:", error.message);
    return next(new ErrorHandler("Server Error", 500));
  }
};

export const getMyOrder = async(req, res, next) => {
  try {
    
    const userId = req.user._id;

    if(!userId){
       new ErrorHandler("Unauthorized ueser", 400);
      }
      
      const orders = await ORDERMODEL.find({userId}).sort({createdAt : -1});
      
      if(!orders){
        new ErrorHandler("No Data Found! ", 304);
    }

    res.status(200).json({
      success : true,
      orders,
      message : "All Order Data"
    })
  } catch (error) {
    console.error("Error in get order data:", error.message);
    return next(new ErrorHandler("Server Error", 500));
  }
}


export const getOrderDetails = async(req, res, next) => {
  try {

    const userId = req.user._id;
    const orderId = req.params.id;

    if(!userId || !orderId){

      return next(new ErrorHandler("Unauthorized User", 404));
    }

    const order = await ORDERMODEL.findOne({ _id: orderId, userId })
      .populate("purchaseItems.productId");
    
      // console.log("order : ", order);
    if(!order) {
       return next(new ErrorHandler("Order Not Found!", 404));
    }


    res.status(201).json({
      success : true,
      order,
      message : "All Order's ",
    })
  } catch (error) {
    console.error("Error in Get order Detail:", error.message);
    return next(new ErrorHandler("Server Error", 500));
  }
}

export const cancelOrder = async(req, res, next) => {
  try {

    const userId = req.user._id;
    const orderId = req.params.id;

    if(!userId || !orderId){
      return next( new ErrorHandler("Unaauthorized User", 404));
    }

    const order = await ORDERMODEL.findOne({ _id: orderId, userId });

    
    if(!order){
      return next(new ErrorHandler("Order Not Found!", 404));
    }

    if (order.orderStatus !== "processing") {
      return next(new ErrorHandler ("Cannot cancel this order.", 400));
    }

    order.orderStatus = "cancelled";
    await order.save();
    
    return res.status(200).json({ 
      success: true, 
      message: "Order cancelled successfully." 
    });
  } catch (error) {
    console.error("Error in Cenel Order:", error.message);
    return next(new ErrorHandler("Server Error", 500));
  }
}