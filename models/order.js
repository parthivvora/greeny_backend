const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
  },
  cartId: {
    type: Schema.Types.ObjectId,
  },
  paymentId: {
    type: String,
  },
  totalAmount: {
    type: Number,
  },
  paymentMethod: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  orderDate: {
    type: Date,
    default: Date.now(),
  },
  deliveryStatus: {
    type: String,
    enum: ["Pending", "Confirmed", "Shipped", "Out For Delivery", "Delivered"],
    default: "Pending",
  },
  orderStatus: {
    type: String,
    enum: ["Success", "Cancel"],
    default: "Success",
  },
  reason: {
    type: String,
    default: "",
  },
});

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
