const express = require("express")
const { adminAuth } = require("../middleware/adminAuth")
const bannerImageUpload = require("../middleware/bannerImageUpload")
const { addBanners, getAllBannerData, updateBanner, deleteBanner } = require("../controllers/banner.controller")
const router = express.Router()

router.post("/addBanner", adminAuth, bannerImageUpload.single("bannerImage"), addBanners)
router.get("/getAllBanners", getAllBannerData)
router.put("/updateBanner/:bannerId", adminAuth, bannerImageUpload.single("bannerImage"), updateBanner)
router.delete("/deleteBanner/:bannerId", adminAuth, deleteBanner)

// router.put("/updateBlogStatus/:blogId", adminAuth, updateBlogStatus)

module.exports = router