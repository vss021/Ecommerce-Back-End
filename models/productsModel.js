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
    productAddedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
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
        default: "https://t3.ftcdn.net/jpg/05/08/16/68/360_F_508166846_213FSKJfFuio2g1e4FeYVguHsFfzTDKx.jpg",
      },
      public_id: {
        type: String,
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

    // Likes
    likes: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }],

    purchaseCount: {
      type: Number,
      default: 0,
    },

    color: [
      {
        type: String,
        default: '',
      },
    ],

    size: [
      {
        type: String,
        default: 'small',
      },
    ],


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
