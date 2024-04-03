const express = require("express")
const { adminAuth } = require("../middleware/adminAuth")
const { addCategory, getAllCategoryData, updateCategory, updateCategoryStatus } = require("../controllers/category.controller")
const router = express.Router()

router.post("/addCategory", adminAuth, addCategory)
router.get("/getAllCategory", getAllCategoryData)
router.put("/updateCategory/:categoryId", adminAuth, updateCategory)
router.put("/updateCategoryStatus/:categoryId", adminAuth, updateCategoryStatus)

module.exports = router