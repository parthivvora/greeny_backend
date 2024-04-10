const mongoose = require("mongoose");

const productReviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    message: {
      type: String,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const productReviewModel = mongoose.model("productReview", productReviewSchema);
module.exports = productReviewModel;
