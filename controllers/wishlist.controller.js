const { default: mongoose } = require("mongoose");
const {
  responseStatusText,
  responseStatusCode,
} = require("../helper/responseHelper");
const wishlistModel = require("../models/wishlist");

// Add to wishlist by User
exports.addWishlist = async (req, res) => {
  try {
    const isWishlistData = await wishlistModel.findOne({
      $and: [
        { userId: { $eq: req.userId } },
        { productId: { $eq: req.body.productId } },
      ],
    });
    if (isWishlistData) {
      return res.status(responseStatusCode.FORBIDDEN).json({
        status: responseStatusText.WARNING,
        message: "This product is already in your wishlist...!",
      });
    }
    const newWishlist = {
      userId: req.userId,
      productId: req.body.productId,
    };
    await wishlistModel.create(newWishlist);
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      message: "Your product is add successfully into wishlist...!",
    });
  } catch (error) {
    console.log("🚀 ~ exports.addWishlist= ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Get all product of wishlist using userId
exports.getAllWishlist = async (req, res) => {
  try {
    const wishlistData = await wishlistModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: {
          path: "$productDetails",
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "productDetails.productBrand",
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
        $match: {
          isDeleted: false,
        },
      },
      {
        $project: {
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
          productBrand: 0,
          "productDetails._id": 0,
          "productDetails.productWeight": 0,
          "productDetails.productStyle": 0,
          "productDetails.productProperties": 0,
          "productDetails.productStatus": 0,
          "productDetails.__v": 0,
          "brandDetails._id": 0,
          "brandDetails.totalItems": 0,
          "brandDetails.brandImage": 0,
          "brandDetails.brandStatus": 0,
          "brandDetails.createdAt": 0,
          "brandDetails.updatedAt": 0,
          "brandDetails.__v": 0,
        },
      },
    ]);
    if (wishlistData.length > 0) {
      var row = "";
      Object.keys(wishlistData).forEach((key) => {
        row = wishlistData[key];
        row.productDetails.productImage =
          `${process.env.IMAGE_URL}/products/` +
          row.productDetails.productImage;
      });
      return res.status(responseStatusCode.SUCCESS).json({
        status: responseStatusText.SUCCESS,
        wishlistData,
      });
    }
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      message: "No product into your wishlist...!",
    });
  } catch (error) {
    console.log("🚀 ~ exports.getAllWishlistProduct= ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Delete wishlist item using wishlistId and userId
exports.deleteWishlist = async (req, res) => {
  try {
    const { userId } = req;
    const { wishlistId } = req.params;
    await wishlistModel.updateOne(
      {
        $and: [
          { _id: new mongoose.Types.ObjectId(wishlistId) },
          { userId: new mongoose.Types.ObjectId(userId) },
        ],
      },
      { $set: { isDeleted: true } },
      { new: true }
    );
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      message: "Your product is deleted successfully from your wishlist...!",
    });
  } catch (error) {
    console.log("🚀 ~ exports.deleteCart ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Total count of wishlist data
exports.totalCountWishlist = async (req, res) => {
  try {
    const { userId } = req;
    const data = await wishlistModel.aggregate([
      {
        $match: {
          $and: [
            { userId: new mongoose.Types.ObjectId(userId) },
            { isDeleted: false },
          ],
        },
      },
      {
        $count: "totalData",
      },
    ]);
    const totalCountWishlistData = data.length > 0 ? data[0] : { totalData: 0 };
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      totalCountWishlistData,
    });
  } catch (error) {
    console.log("🚀 ~ exports.totalCountWishlist= ~ error:", error)
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};
