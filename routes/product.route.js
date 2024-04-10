const express = require("express");
const {
  addProducts,
  updateProduct,
  getAllProductData,
  updateProductStatus,
  getAllSingleProductData,
  getCategoryProduct,
  addProductsReviews,
  getAllProductsReviews,
  deleteProductReview,
} = require("../controllers/product.controller");
const { adminAuth } = require("../middleware/adminAuth");
const productImageUpload = require("../middleware/productImageUpload");
const { userAuth } = require("../middleware/userAuth");
const router = express.Router();

router.post(
  "/addProduct",
  adminAuth,
  productImageUpload.single("productImage"),
  addProducts
);
router.put(
  "/editProduct/:productId",
  adminAuth,
  productImageUpload.single("productImage"),
  updateProduct
);
router.get("/getAllProducts", getAllProductData);
router.get("/getAllSingleProductData/:productId", getAllSingleProductData);
router.get("/getCategoryProduct/:categoryId", getCategoryProduct);
router.put("/updateProductStatus/:productId", adminAuth, updateProductStatus);

// Product Review API
router.post("/addProductsReviews", userAuth, addProductsReviews);
router.get("/getAllProductsReviews", adminAuth, getAllProductsReviews);
router.delete("/deleteProductReview/:reviewId", adminAuth, deleteProductReview);

module.exports = router;
