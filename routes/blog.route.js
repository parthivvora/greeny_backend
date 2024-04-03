const express = require("express")
const { createBlog, getAllBlogs, getSingleBlog, updateBlog, updateBlogStatus, deleteBlog } = require("../controllers/blog.controller")
const blogImageUpload = require("../middleware/blogImageUpload")
const { adminAuth } = require("../middleware/adminAuth")
const router = express.Router()

router.post("/createBlog", adminAuth, blogImageUpload.single("blogImage"), createBlog)
router.get("/getAllBlogs", getAllBlogs)
router.get("/getSingleBlog/:blogId", getSingleBlog)
router.put("/updateBlog/:blogId", adminAuth, blogImageUpload.single("blogImage"), updateBlog)
router.put("/updateBlogStatus/:blogId", adminAuth, updateBlogStatus)
router.delete("/deleteBlog/:blogId", adminAuth, deleteBlog)

module.exports = router