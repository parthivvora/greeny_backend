const express = require("express");
const { adminAuth } = require("../middleware/adminAuth");
const { addComments, getAllCommentData, deleteComment } = require("../controllers/comment.controller");
const router = express.Router();

router.post("/addComments", addComments);
router.get("/getAllCommentData", getAllCommentData)
router.delete("/deleteComment/:commentId", adminAuth, deleteComment)

module.exports = router;
