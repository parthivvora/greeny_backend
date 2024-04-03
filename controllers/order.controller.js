const { default: mongoose } = require("mongoose");
const {
  responseStatusCode,
  responseStatusText,
} = require("../helper/responseHelper");
const orderModel = require("../models/order");

// Get all order of users using userId
exports.getAllOrdersUserById = async (req, res) => {
  try {
    const { userId } = req;
    console.log("🚀 ~ exports.getAllOrdersUserById= ~ userId:", userId);

    const orderData = await orderModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "carts",
          localField: "cartId",
          foreignField: "_id",
          as: "cartDetails",
        },
      },
      {
        $unwind: {
          path: "$cartDetails",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "cartDetails.productId",
          foreignField: "_id",
          as: "productsDetails",
        },
      },
      {
        $unwind: {
          path: "$productsDetails",
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "productsDetails.productBrand",
          foreignField: "_id",
          as: "brandDetails",
        },
      },
      {
        $unwind: {
          path: "$brandDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
        },
      },
      {
        $project: {
          __v: 0,
          "cartDetails.__v": 0,
          "productsDetails.__v": 0,
          "brandDetails.__v": 0,
          "userDetails.__v": 0,
        },
      },
    ]);
    if (orderData.length > 0) {
      var row = "";
      Object.keys(orderData).forEach((key) => {
        row = orderData[key];
        row.productsDetails.productImage =
          `${process.env.IMAGE_URL}/products/` +
          row.productsDetails.productImage;
      });
      return res.status(responseStatusCode.SUCCESS).json({
        status: responseStatusText.SUCCESS,
        orderData,
      });
    }
    return res.status(responseStatusCode.FORBIDDEN).json({
      status: responseStatusText.ERROR,
      message: "No order data here...!",
    });
  } catch (error) {
    console.log("🚀 ~ exports.getAllOrdersUserById= ~ error:", error);
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
