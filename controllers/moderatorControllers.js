import PRODUCTMODEL from "../models/productsModel.js";
import ErrorHandler from "../middlewares/ErrorHandler.js";

export const addModeratorProduct = async (req, res, next) => {
  try {

    // console.log("Moderator Controller ");

    const _id = req.user._id;

    if (!_id) {
      return next(new ErrorHandler("Sign In Again !", 402));
    }

    const {
      productName,
      description,
      brand,
      categories,
      price,
      discountPercentage,
      finalPrice,
      currency,
      inventoryCount,
      averageRating,
      isAvailable,
    } = req.body;

    const newProduct = {
      productAddedBy: _id, // assuming _id comes from req.user or similar
      productName,
      description,
      brand,
      categories,
      price,
      discountPercentage,
      finalPrice,
      currency,
      inventoryCount,
      averageRating,
      reviews: [],
      isAvailable,
    };

    
    const productCreateed = await PRODUCTMODEL.create( newProduct );
    if(!productCreateed){
        return next( new ErrorHandler("Product Not Created", 302));
    }
    // console.log("Product Crated SuccessFully Details : ", productCreateed);

    res.status(201).json({
      success: true,
      productCreateed,
      message : "Product Created!"
    });
  } catch (error) {
    console.error("Product Creating by Modeeator error:", error.message);
    return next(new ErrorHandler("Server Erroro", 500));
  }
};


export const getAllProductsByModerator = async(req, res, next) => {
    try {

        const _id = req.user;

        if(!_id){
            return next(new ErrorHandler("Access Forbidden!!", 404));
        }

        console.log("Moderator Id : ", _id);

        const products = await PRODUCTMODEL.find({ productAddedBy: _id });

        if(!products){
            return next( new ErrorHandler("Products Not Found", 404));
        }

        res.status(201)
        .json({
            success : true,
            products,
            message : "All Products!"
        });
    } catch (error) {
    console.error("Product Getting by Moderator error:", error.message);
    return next(new ErrorHandler("Server Erroro", 500));
    }
}

export const getOneProductData = async(req, res, next) => {
    try {

        const moderatorId = req.user._id?.toString();
        const productId = req.params.id?.toString();
        
        if(!moderatorId || ! productId){
           return next( new ErrorHandler("Product Id required!, ", 400));
        }

        // Find the product and check ownership in one query
        const product = await PRODUCTMODEL.findOne({ _id: productId, productAddedBy: moderatorId });

        if (!product) {
            return next(new ErrorHandler("Product not found or unauthorized to update", 404));
        }

        res.status(201).json({
            success : true,
            product,
        });
        
    } catch (error) {
        console.error("Product getting one Product by Moderator :", error.message);
        return next(new ErrorHandler("Server Erroro", 500));
    }
}

export const deleteProductsByModerator = async(req, res, next) => {
    try {
        const productId = req.params.id;
        const moderatorId = req.user._id;
        

        /*
        ***** approach to 1 to validate only added moderator delete products

            Two DB hits: One to findById  -> for product data
                        and 
             one to -> findByIdAndDelete. -> after checking it moderator how is oner of product then -> delete 

            Unnecessary data retrieval: You're fetching the whole document just to check ownership and then delete.
        */ 
       // const deleteProduct = await PRODUCTMODEL.findByIdAndDelete(productId);


       /**
        *  ***********Optimized Solution: Do it in One Query
        *   Approach:
            ✅ Only 1 DB call (findOneAndDelete)

            ✅ Secure (enforces ownership in the query itself)

            ✅ Faster (MongoDB handles matching and deleting in one go)

            ✅ Cleaner code
        */

        if(!productId || !moderatorId){
            return next( new ErrorHandler("Product Id required!, ", 400));
        }

        const deleteProduct = await PRODUCTMODEL.findByIdAndDelete({
            _id : productId,
            productAddedBy : moderatorId,
        })

        if(!deleteProduct){
            return next( new ErrorHandler("Product is Not Found", 404));
        }

        res.status(201).json({success : true, message : "Product Deleted"});
    } catch (error) {
    console.error("Product Deletign error by Moderator :", error.message);
    return next(new ErrorHandler("Server Erroro", 500));
    }
}

export const UpdateProductsDetailsByModerator = async (req, res, next) => {
  try {
    const moderatorId = req.user._id?.toString();
    const productId = req.params.id?.toString();

    if (!moderatorId || !productId) {
      return next(new ErrorHandler("Moderator ID and Product ID are required!", 400));
    }

    // Find the product and check ownership in one query
    const product = await PRODUCTMODEL.findOne({ _id: productId, productAddedBy: moderatorId });

    if (!product) {
      return next(new ErrorHandler("Product not found or unauthorized to update", 404));
    }

    // Only include fields that are provided in the request body
    const allowedFields = [
      "productName", "description", "brand", "categories", "price",
      "discountPercentage", "finalPrice", "currency", "inventoryCount",
      "averageRating", "isAvailable"
    ];

    const updateFields = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    // Update the product
    const updatedProduct = await PRODUCTMODEL.findByIdAndUpdate(
      productId,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      updatedProduct
    });

  } catch (error) {
    console.error("Error updating product by moderator:", error.message);
    return next(new ErrorHandler("Server Error", 500));
  }
};
