const express = require("express")
const { adminAuth } = require("../middleware/adminAuth")
const { getAllSubscribeList, subscribeByUser } = require("../controllers/subscribe.controller")
const router = express.Router()

router.post("/subscribeByUser", subscribeByUser)
router.get("/getAllSubscribeList", adminAuth, getAllSubscribeList)

module.exports = router