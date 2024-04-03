const {
  responseStatusCode,
  responseStatusText,
} = require("../helper/responseHelper");
const contactModel = require("../models/contact");
const { contactValidation } = require("../validation/contact.validation");

// Add contact query data by user
exports.contactData = async (req, res) => {
  try {
    const { error, value } = contactValidation.validate(req.body);
    if (error) {
      return res.status(responseStatusCode.FORBIDDEN).json({
        status: responseStatusText.ERROR,
        message: error.details[0].message,
      });
    }
    await contactModel.create(value);
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      message: "Contact query add successfully...!",
    });
  } catch (error) {
    console.log("🚀 ~ exports.contactData= ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Get all contact queries by admin
exports.getAllContactQueryData = async (req, res) => {
  try {
    const contactQueryData = await contactModel
      .find()
      .select("-__v -updatedAt");
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      contactQueryData,
    });
  } catch (error) {
    console.log("🚀 ~ exports.getAllContactQueryData= ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};
