import ErrorHandler from "../middlewares/ErrorHandler.js";
import ORDERMODEL from "../models/orderModel.js";

export const getModeratorAllProductsOrders = async (req, res, next) => {
  try {
    const moderatorId = req.user._id;

    // Fetch all orders that are not cancelled

    const orders = await ORDERMODEL.find({
      orderStatus: { $ne: "cancelled" }, // ✅ skip cancelled orders

      purchaseItems: { $exists: true, $ne: [] },
    }).populate("purchaseItems.productId");

    if (!orders || orders.length === 0) {
      return next(new ErrorHandler("No orders found!", 404));
    }

    const moderatorOrders = [];

    orders.forEach((order) => {
      // Filter items where the product belongs to the moderator
      const relevantItems = order.purchaseItems.filter(
        (item) =>
          item.productId?.productAddedBy?.toString() === moderatorId.toString()
      );

      if (relevantItems.length > 0) {
        moderatorOrders.push({
          _id: order._id,
          userId: order.userId,
          purchaseItems: relevantItems,
          totalAmount: relevantItems.reduce(
            (sum, item) => sum + item.priceAtPurchase * item.quantity,
            0
          ),
          createdAt: order.createdAt,
          orderStatus: order.orderStatus,
        });
      }
    });

    return res.status(200).json({
      success: true,
      orders: moderatorOrders,
    });
  } catch (error) {
    return next(new ErrorHandler("Server Error", 500));
  }
};


export const getModeratorEarningsAndRefunds = async (req, res, next) => {
  try {
    const moderatorId = req.user._id;

    const orders = await ORDERMODEL.find().populate("purchaseItems.productId");

    let totalEarnings = 0;
    let totalRefunds = 0;

    orders.forEach(order => {
      order.purchaseItems.forEach(item => {
        const product = item.productId;

        if (product?.productAddedBy?.toString() === moderatorId.toString()) {
          const amount = item.priceAtPurchase * item.quantity;

          if (order.orderStatus === "cancelled") {
            totalRefunds += amount;
          } else {
            totalEarnings += amount;
          }
        }
      });
    });

    return res.status(200).json({
      success: true,
      earnings: totalEarnings,
      refunds: totalRefunds,
      netEarnings: totalEarnings - totalRefunds,
    });

  } catch (error) {
    return next(new ErrorHandler("Server Error while calculating earnings/refunds", 500));
  }
};


export const updateModeratorOrderItemStatus = async (req, res, next) => {
  try {
    const { orderId, productId, itemStatus } = req.body;
    const moderatorId = req.user._id;

    const order = await ORDERMODEL.findById(orderId).populate("purchaseItems.productId");

    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    const item = order.purchaseItems.find(
      item => item.productId._id.toString() === productId &&
              item.productId.productAddedBy?.toString() === moderatorId.toString()
    );

    if (!item) {
      return next(new ErrorHandler("Product not found in order or not authorized", 403));
    }

    item.itemStatus = itemStatus;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order item status updated",
      updatedStatus: itemStatus,
    });

  } catch (error) {
    return next(new ErrorHandler("Server Error while updating item status", 500));
  }
};
