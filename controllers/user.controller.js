const jwt = require("jsonwebtoken");
const {
  responseStatusCode,
  responseStatusText,
} = require("../helper/responseHelper");
const userModel = require("../models/user");
const {
  userRegisterValidation,
  userLoginValidation,
} = require("../validation/user.validation");
const { default: mongoose } = require("mongoose");
const fs = require("fs");

// User register
exports.userRegister = async (req, res) => {
  try {
    const { error, value } = userRegisterValidation.validate(req.body);
    if (error) {
      return res.status(responseStatusCode.FORBIDDEN).json({
        status: responseStatusText.ERROR,
        message: error.details[0].message,
      });
    }
    await userModel.create(value);
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      message: "You are successfully register...!",
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: user.controller.js:20 ~ exports.userRegister= ~ error:",
      error
    );
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// User login
exports.userLogin = async (req, res) => {
  try {
    const { error, value } = userLoginValidation.validate(req.body);
    if (error) {
      return res.status(responseStatusCode.FORBIDDEN).json({
        status: responseStatusText.ERROR,
        message: error.details[0].message,
      });
    }
    const isUser = await userModel.findOne({
      $and: [
        {
          email: value.email,
        },
        {
          password: value.password,
        },
      ],
    });
    if (isUser) {
      const userToken = await jwt.sign(
        { userId: isUser._id },
        process.env.JWT_SECRET
      );
      return res.status(responseStatusCode.SUCCESS).json({
        status: responseStatusText.SUCCESS,
        message: "You are successfully login...!",
        userData: { userId: isUser._id, userName: isUser.name, userToken },
      });
    }
    return res.status(responseStatusCode.UNAUTHORIZED).json({
      status: responseStatusText.ERROR,
      message: "Invalid email or password...!",
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: user.controller.js:63 ~ exports.userLogin= ~ error:",
      error
    );
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Get user own profile information
exports.getUserProfileDetails = async (req, res) => {
  try {
    const userData = await userModel.findOne({
      _id: { $eq: new mongoose.Types.ObjectId(req.userId) },
    });
    userData.userImage = `${process.env.IMAGE_URL}/users/` + userData.userImage;

    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      userData,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: user.controller.js:80 ~ exports.getUserProfileDetails= ~ error:",
      error
    );
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Edit user profile information
exports.editUserProfileDetails = async (req, res) => {
  const data = JSON.parse(req.body.userInfo);
  try {
    if (req.file) {
      const newObj = {
        name: data.name,
        email: data.email,
        contact: data.contact,
        address: data.address,
        addressType: data.addressType,
        userImage: req.file.filename,
      };
      await userModel.updateOne(
        {
          _id: { $eq: new mongoose.Types.ObjectId(req.userId) },
        },
        { $set: newObj }
      );
    } else {
      await userModel.updateOne(
        {
          _id: { $eq: new mongoose.Types.ObjectId(req.userId) },
        },
        { $set: data }
      );
    }
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      message: "Your profile is updated...!",
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: user.controller.js:98 ~ exports.editUserProfileDetails= ~ error:",
      error
    );
    fs.unlinkSync(req.file.path);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Change user profile password
exports.changePassword = async (req, res) => {
  try {
    const { currentPass, newPass } = req.body;
    const isUserMatchPassword = await userModel.findOne({
      $and: [
        { _id: new mongoose.Types.ObjectId(req.userId) },
        { password: currentPass },
      ],
    });
    if (isUserMatchPassword) {
      await userModel.updateOne(
        {
          _id: { $eq: new mongoose.Types.ObjectId(req.userId) },
        },
        { $set: { password: newPass } }
      );
      return res.status(responseStatusCode.SUCCESS).json({
        status: responseStatusText.SUCCESS,
        message: "Your password is changed...!",
      });
    }
    return res.status(responseStatusCode.FORBIDDEN).json({
      status: responseStatusText.ERROR,
      message: "Your old password is not corrected...!",
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: user.controller.js:156 ~ exports.changePassword= ~ error:",
      error
    );
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Get all user information
exports.getAllUser = async (req, res) => {
  try {
    const userData = await userModel.find();
    if (userData.length > 0) {
      var row = "";
      Object.keys(userData).forEach((key) => {
        row = userData[key];
        row.userImage = `${process.env.IMAGE_URL}/users/` + row.userImage;
      });
      return res.status(responseStatusCode.SUCCESS).json({
        status: responseStatusText.SUCCESS,
        userData,
      });
    }
    return res.status(responseStatusCode.FORBIDDEN).json({
      status: responseStatusText.ERROR,
      message: "No user data found...!",
    });
  } catch (error) {
    console.log("🚀 ~ exports.getAllUser= ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};
