const {
  responseStatusCode,
  responseStatusText,
} = require("../helper/responseHelper");
const subscribeModel = require("../models/subscribe");

// Subscribe by user
exports.subscribeByUser = async (req, res) => {
  try {
    await subscribeModel.create(req.body);
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      message: "Subscribe successfully...!",
    });
  } catch (error) {
    console.log("🚀 ~ exports.subscribeByUser= ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Get all subscribe by admin
exports.getAllSubscribeList = async (req, res) => {
  try {
    const subscribeData = await subscribeModel.find().select("-__v -updatedAt");
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      subscribeData,
    });
  } catch (error) {
    console.log("🚀 ~ exports.getAllSubscribeList= ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};
