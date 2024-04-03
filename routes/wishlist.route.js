const express = require("express")
const { userAuth } = require("../middleware/userAuth")
const { addWishlist, deleteWishlist, getAllWishlist, totalCountWishlist } = require("../controllers/wishlist.controller")
const router = express.Router()

router.post("/addWishlist", userAuth, addWishlist)
router.get("/getAllWishlist", userAuth, getAllWishlist)
router.delete("/deleteWishlist/:wishlistId", userAuth, deleteWishlist)
router.get("/totalCountWishlist", userAuth, totalCountWishlist)

module.exports = router