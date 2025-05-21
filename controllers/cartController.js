import ErrorHandler from "../middlewares/ErrorHandler.js";
import CARTMODEL from "../models/cartModel.js";
import PRODUCTMODEL from "../models/productsModel.js";
import USER from "../models/userModel.js";

// ***************User Controllers
export const LikeProducts = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;

    if (!productId | !userId) {
      return next(new ErrorHandler("Not Found !", 404));
    }

    const product = await PRODUCTMODEL.findById(productId);
    const user = await USER.findById(userId);

    if (!product || !user) {
      return next(new ErrorHandler("Not found", 404));
    }

    // check for user like

    const alreadyLiked = product.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      product.likes.pull(userId);
      user.likeCount = Math.max(0, user.likeCount - 1);
    } else {
      // Like
      product.likes.push(userId);
      user.likeCount += 1;
    }

    await product.save();
    await user.save();

    return res.status(200).json({
      success: true,
      message: alreadyLiked
        ? "Product unliked successfully"
        : "Product liked successfully",
    });
  } catch (error) {
    console.log("Error from Like Count", error.message);
    return next(ErrorHandler("Server Error", 500));
  }
};

export const addToCartProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;

    if (!productId || !userId) {
      return next(new ErrorHandler("Product ID or User ID is required", 400));
    }

    const user = await USER.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const product = await PRODUCTMODEL.findById(productId);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    // Find or create cart
    let cart = await CARTMODEL.findOne({ userId });

    if (!cart) {
      cart = new CARTMODEL({
        userId,
        cartAddedProducts: [{ productId, quantity: 1 }],
      });
    } else {
      // Check if product is already in cart
      const existingItem = cart.cartAddedProducts.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        // Increase quantity by 1
        existingItem.quantity += 1;
      } else {
        // Add new product to cart
        cart.cartAddedProducts.push({ productId, quantity: 1 });
      }
    }

    // Save cart
    await cart.save();

    // Update user's cartInfo
    user.cartInfo = user.cartInfo || {};
    user.cartInfo.cartId = cart._id;
    user.cartInfo.cartItemCount = cart.cartAddedProducts.reduce(
      (total, item) => total + item.quantity,
      0
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cartItemsCount: user.cartInfo.cartItemCount,
      cart: cart.cartAddedProducts,
    });
  } catch (error) {
    console.error("Error in addToCartProduct:", error.message);
    return next(new ErrorHandler("Server Error", 500));
  }
};

export const removeFromCartProduct = async (req, res, next) => {
  try {
    const productId = req.params.id.toString();
    const userId = req.user._id.toString();

    if (!productId || !userId) {
      return next(new ErrorHandler("Product ID or User ID missing", 400));
    }

    const cart = await CARTMODEL.findOne({ userId });

    if (!cart) {
      return next(new ErrorHandler("Cart not found", 404));
    }

    // Find product index by matching productId
    const index = cart.cartAddedProducts.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index === -1) {
      return res.status(400).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Remove product from cart
    cart.cartAddedProducts.splice(index, 1);
    await cart.save();

    // Update user's cartInfo count
    const user = await USER.findById(userId);
    if (user && user.cartInfo) {
      user.cartInfo.cartItemCount = cart.cartAddedProducts.reduce(
        (total, item) => total + item.quantity,
        0
      );
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cartItemsCount: cart.cartAddedProducts.reduce(
        (total, item) => total + item.quantity,
        0
      ),
      cart: cart.cartAddedProducts,
    });
  } catch (error) {
    console.error("Error in removeFromCartProduct:", error.message);
    return next(new ErrorHandler("Server Error", 500));
  }
};

export const updateCartQuantity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;
    const { action } = req.body; // "increase" or "decrease"

    // console.log("userId", userId);
    // console.log("pId", productId);
    // console.log("action", action);

    if (!userId || !productId || !["increase", "decrease"].includes(action)) {
      return next(new ErrorHandler("Invalid input", 400));
    }

    const cart = await CARTMODEL.findOne({ userId });
    if (!cart) {
      return next(new ErrorHandler("Cart not found", 404));
    }

    const index = cart.cartAddedProducts.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index === -1) {
      return next(new ErrorHandler("Product not in cart", 404));
    }

    // console.log(
    //   `Before update, quantity: ${cart.cartAddedProducts[index].quantity}`
    // );

    if (action === "increase") {
      cart.cartAddedProducts[index].quantity += 1;
    } else if (action === "decrease") {
      if (cart.cartAddedProducts[index].quantity > 1) {
        cart.cartAddedProducts[index].quantity -= 1;
      } else {
        // Remove product if quantity is 1 and decrease requested
        cart.cartAddedProducts.splice(index, 1);
      }
    }

    // console.log(`After update, cartAddedProducts:`, cart.cartAddedProducts);

    await cart.save();

    // Update user's cart item count (sum of quantities)
    const user = await USER.findById(userId);
    if (user && user.cartInfo) {
      user.cartInfo.cartItemCount = cart.cartAddedProducts.reduce(
        (total, item) => total + item.quantity,
        0
      );
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cartItems: cart.cartAddedProducts,
      cartItemsCount: user?.cartInfo?.cartItemCount || 0,
    });
  } catch (error) {
    console.error("Error in updateCartQuantity:", error.message);
    return next(new ErrorHandler("Server Error", 500));
  }
};
