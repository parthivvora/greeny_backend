const { default: mongoose } = require("mongoose");
const {
  responseStatusText,
  responseStatusCode,
} = require("../helper/responseHelper");
const commentModel = require("../models/comment");
const { commentValidation } = require("../validation/comment.validation");

// Add comment by User
exports.addComments = async (req, res) => {
  try {
    const { error, value } = commentValidation.validate(req.body);
    if (error) {
      return res.status(responseStatusCode.FORBIDDEN).json({
        status: responseStatusText.ERROR,
        message: error.details[0].message,
      });
    }
    commentModel.create(value);
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      message: "Comment add successfully...!",
    });
  } catch (error) {
    console.log("🚀 ~ exports.addComments= ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Get all comment data
exports.getAllCommentData = async (req, res) => {
  try {
    const commentData = await commentModel.find().select("-__v -updatedAt");
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      commentData,
    });
  } catch (error) {
    console.log("🚀 ~ exports.getAllCommentData= ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Delete comment by Admin using commentId
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { status } = req.query;
    
    await commentModel.updateOne(
      { _id: new mongoose.Types.ObjectId(commentId) },
      { $set: { isDeleted: status } },
      { new: true }
    );
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      message: "Comments is updated successfully...!",
    });
  } catch (error) {
    console.log("🚀 ~ exports.deleteComment ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};
