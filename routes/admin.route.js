const express = require("express")
const { adminLogin, totalCount } = require("../controllers/admin.controller")
const { adminAuth } = require("../middleware/adminAuth")
const router = express.Router()

router.post("/login", adminLogin)
router.get("/totalCount", adminAuth, totalCount)

module.exports = router