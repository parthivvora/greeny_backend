const jwt = require("jsonwebtoken");
const {
  responseStatusCode,
  responseStatusText,
} = require("../helper/responseHelper");
const adminModel = require("../models/admin");
const { adminLoginValidation } = require("../validation/admin.validation");
const userModel = require("../models/user");
const bannerModel = require("../models/banner");
const categoryModel = require("../models/category");
const productModel = require("../models/product");

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    const { error, value } = adminLoginValidation.validate(req.body);
    if (error) {
      return res.status(responseStatusCode.FORBIDDEN).json({
        status: responseStatusText.ERROR,
        message: error.details[0].message,
      });
    }
    const isAdmin = await adminModel.findOne({
      $and: [
        {
          email: value.email,
        },
        {
          password: value.password,
        },
      ],
    });
    if (isAdmin) {
      const adminToken = await jwt.sign(
        { adminId: isAdmin._id },
        process.env.JWT_SECRET
      );
      return res.status(responseStatusCode.SUCCESS).json({
        status: responseStatusText.SUCCESS,
        message: "You are successfully login...!",
        adminToken,
      });
    }
    return res.status(responseStatusCode.FORBIDDEN).json({
      status: responseStatusText.ERROR,
      message: "Invalid email or password...!",
    });
  } catch (error) {
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

exports.totalCount = async (req, res) => {
  try {
    const userCount = await userModel.find();
    const categoryCount = await categoryModel.find();
    const productCount = await productModel.find();
    const bannerCount = await bannerModel.find();

    const totalCount = {
      userCount: userCount.length,
      categoryCount: categoryCount.length,
      productCount: productCount.length,
      bannerCount: bannerCount.length,
    };

    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      totalCount,
    });
  } catch (error) {
    // // // console.log("🚀 ~ exports.totalCount= ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};
