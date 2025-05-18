import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
    },
    reviewDate: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      default: "",
    },
    categories: [
      {
        type: String,
        index: true,
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    finalPrice: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    inventoryCount: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrls: [
      {
        url: {
          type: String,
          required: true,
        },
        imageAltText: {
          type: String,
          default: "",
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto calculate finalPrice before save
productSchema.pre("save", function (next) {
  if (this.discountPercentage > 0) {
    this.finalPrice = this.price - this.price * (this.discountPercentage / 100);
  } else {
    this.finalPrice = this.price;
  }
  next();
});

const PRODUCTMODEL = mongoose.model("PRODUCTMODEL", productSchema);

export default PRODUCTMODEL;
