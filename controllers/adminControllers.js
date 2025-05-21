import ErrorHandler from "../middlewares/ErrorHandler.js";
import USER from "../models/userModel.js";
import PRODUCTMODEL from "../models/productsModel.js";
import ORDERMODEL from "../models/orderModel.js";


// **********************Fetch all users (with roles/status)
export const GetAllUsers = async(req, res, next) => {
    try {
        
        const users = await USER.find().select("-password");
        res.status(201).json({
            success : true,
            users,
        });
    } catch (error) {
        return next(new ErrorHandler("Failed to fetch users", 500));
    }
}



//****************** */ Change a user's role (e.g., user ➝ moderator)

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await USER.findById(req.params.userId);

    if (!user) return next(new ErrorHandler("User not found", 404));

    user.role = role;
    await user.save();

    res.status(200).json({ success: true, message: "Role updated successfully" });
  } catch (err) {
    return next(new ErrorHandler("Failed to update role", 500));
  }
};


// ******************Delete a user account
export const deleteUserAccount = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await USER.findById(userId);
    if (!user) return next(new ErrorHandler("User not found", 404));

    // 1. Delete all products added by this user (if they're a moderator)
    await PRODUCTMODEL.deleteMany({ productAddedBy: userId });

    // 2. Remove their orders (or mark them as 'deleted user')
    await ORDERMODEL.updateMany(
      { userId },
      { $set: { userId: null, orderNote: "Placed by deleted user" } }
    );

    // 3. You may want to clear from CARTMODEL, WISHLISTMODEL, etc. if applicable
    // await CARTMODEL.deleteMany({ userId });

    // 4. Finally delete user
    await USER.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User and associated references deleted successfully",
    });
  } catch (err) {
    return next(new ErrorHandler("Failed to delete user", 500));
  }
};


// ******************* Get All Orders
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await ORDERMODEL.find().populate("purchaseItems.productId userId");
    res.status(200).json({ success: true, orders });
  } catch (err) {
    return next(new ErrorHandler("Failed to fetch orders", 500));
  }
};


// ****************Update status of any order (shipped, delivered, etc.

export const updateAnyOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const order = await ORDERMODEL.findById(req.params.orderId);

    if (!order) return next(new ErrorHandler("Order not found", 404));

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({ success: true, message: "Order status updated" });
  } catch (err) {
    return next(new ErrorHandler("Failed to update order status", 500));
  }
};

// *************View stats like total users, orders, revenue, etc.
// 6. Get Site Stats
export const getSiteStats = async (req, res, next) => {
  try {
    const userCount = await USER.countDocuments();
    const orderCount = await ORDERMODEL.countDocuments();
    const productCount = await PRODUCTMODEL.countDocuments();
    const totalRevenue = await ORDERMODEL.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        userCount,
        orderCount,
        productCount,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (err) {
    return next(new ErrorHandler("Failed to fetch stats", 500));
  }
};


// **************************************
//                  PRODUCTS SECTION
// ***************************************


// *********GET ALL PRODUCTS

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await PRODUCTMODEL.find().populate("productAddedBy");
    res.status(200).json({ success: true, products });
  } catch (err) {
    return next(new ErrorHandler("Failed to fetch products", 500));
  }
};


//********************* */ Delete Any Product


export const deleteAnyProduct = async (req, res, next) => {
  try {
    const product = await PRODUCTMODEL.findByIdAndDelete(req.params.productId);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    return next(new ErrorHandler("Failed to delete product", 500));
  }
};

// 9. Update Any Product
export const updateAnyProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const updates = req.body;

    const product = await PRODUCTMODEL.findByIdAndUpdate(productId, updates, { new: true });
    if (!product) return next(new ErrorHandler("Product not found", 404));

    res.status(200).json({ success: true, message: "Product updated", product });
  } catch (err) {
    return next(new ErrorHandler("Failed to update product", 500));
  }
};

// 10. Add New Product
export const addNewProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    const newProduct = await PRODUCTMODEL.create(productData);

    res.status(201).json({ success: true, message: "Product added successfully", product: newProduct });
  } catch (err) {
    return next(new ErrorHandler("Failed to add product", 500));
  }
};


export const getProductDetails = async (req, res, next) => {
  try {
    const product = await PRODUCTMODEL.findById(req.params.productId).populate("productAddedBy");

    if (!product) return next(new ErrorHandler("Product not found", 404));

    res.status(200).json({ success: true, product });
  } catch (err) {
    return next(new ErrorHandler("Failed to fetch product details", 500));
  }
};