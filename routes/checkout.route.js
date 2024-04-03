const express = require("express");
const { adminAuth } = require("../middleware/adminAuth");
const { userAuth } = require("../middleware/userAuth");
const {
  checkout,
  orderAdd,
  getAllOrder,
  getAllPayments,
  updateOrderDeliveryStatus,
} = require("../controllers/checkout.controller");
const router = express.Router();

router.post("/checkout", userAuth, checkout);
router.get("/success", orderAdd);
router.get("/getAllOrder", adminAuth, getAllOrder);
router.get("/getAllPayments", adminAuth, getAllPayments);
router.put(
  "/updateOrderDeliveryStatus/:orderId",
  adminAuth,
  updateOrderDeliveryStatus
);

module.exports = router;
