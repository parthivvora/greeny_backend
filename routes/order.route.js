const express = require("express");
const { getAllOrdersUserById } = require("../controllers/order.controller");
const { userAuth } = require("../middleware/userAuth");
const router = express.Router();

router.get("/getAllOrdersUserById", userAuth, getAllOrdersUserById);

// router.get("/getSingleBlog/:blogId", getSingleBlog)
// router.put("/updateBlog/:blogId", adminAuth, blogImageUpload.single("blogImage"), updateBlog)
// router.put("/updateBlogStatus/:blogId", adminAuth, updateBlogStatus)
// router.delete("/deleteBlog/:blogId", adminAuth, deleteBlog)

module.exports = router;
