const { default: mongoose } = require("mongoose");
const {
  responseStatusText,
  responseStatusCode,
} = require("../helper/responseHelper");
const productModel = require("../models/product");
const fs = require("fs");
const {
  addProductValidation,
} = require("../validation/product.validation.js.validation");

// Add products by Admin
exports.addProducts = async (req, res) => {
  try {
    const { error, value } = addProductValidation.validate(req.body);
    if (error) {
      fs.unlinkSync(req.file.path);
      return res.status(responseStatusCode.FORBIDDEN).json({
        status: responseStatusText.ERROR,
        message: error.details[0].message,
      });
    }
    if (!req.file) {
      return res.status(responseStatusCode.FORBIDDEN).json({
        status: responseStatusText.ERROR,
        message: "Please, upload product image...!",
      });
    }
    const newProductData = {
      productName: value.productName,
      productBrand: value.productBrand,
      productPrice: value.productPrice,
      productMeasurement: value.productMeasurement,
      productDescription: value.productDescription,
      productWeight: value.productWeight,
      productStyle: value.productStyle,
      productProperties: value.productProperties,
      productImage: req.file.filename,
      productTags: value.productTags,
      productStatus: value.productStatus,
      categoryId: value.categoryId,
    };
    const productData = await productModel.create(newProductData);
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      message: "Product data add successfully...!",
      productData,
    });
  } catch (error) {
    console.log("🚀 ~ exports.addProducts= ~ error:", error);
    fs.unlinkSync(req.file.path);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Get all product data
exports.getAllProductData = async (req, res) => {
  try {
    const productData = await productModel.aggregate([
      {
        $lookup: {
          from: "wishlists",
          localField: "_id",
          foreignField: "productId",
          as: "wishlistsData",
        },
      },
      {
        $addFields: {
          wishlistStatus: {
            $map: {
              input: "$wishlistsData",
              as: "wishlist",
              in: {
                $cond: {
                  if: { $eq: ["$$wishlist.isDeleted", false] },
                  then: true,
                  else: false,
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          wishlistStatus: {
            $toString: {
              $arrayElemAt: ["$wishlistStatus", 0],
            },
          },
        },
      },
      {
        $project: {
          __v: 0,
          wishlistsData: 0,
        },
      },
    ]);

    if (productData.length > 0) {
      var row = "";
      Object.keys(productData).forEach((key) => {
        row = productData[key];
        row.wishlistStatus = row.wishlistStatus == "true" ? true : false;
        row.productImage =
          `${process.env.IMAGE_URL}/products/` + row.productImage;
      });
      return res.status(responseStatusCode.SUCCESS).json({
        status: responseStatusText.SUCCESS,
        productData,
      });
    }
    return res.status(responseStatusCode.NOT_FOUND).json({
      status: responseStatusText.ERROR,
      message: "No product data here...!",
    });
  } catch (error) {
    console.log("🚀 ~ exports.getAllProductData= ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Get all single product data using productId
exports.getAllSingleProductData = async (req, res) => {
  try {
    const { productId } = req.params;
    const productData = await productModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(productId),
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "productBrand",
          foreignField: "_id",
          as: "brandDetail",
        },
      },
      {
        $unwind: {
          path: "$brandDetail",
        },
      },
      {
        $project: {
          "brandDetail.totalItems": 0,
          "brandDetail.brandImage": 0,
          "brandDetail.brandStatus": 0,
          "brandDetail.createdAt": 0,
          "brandDetail.updatedAt": 0,
          "brandDetail.__v": 0,
          __v: 0,
          productBrand: 0,
        },
      },
    ]);
    if (productData.length > 0) {
      var row = "";
      Object.keys(productData).forEach((key) => {
        row = productData[key];
        row.productImage =
          `${process.env.IMAGE_URL}/products/` + row.productImage;
      });
      return res.status(responseStatusCode.SUCCESS).json({
        status: responseStatusText.SUCCESS,
        productData,
      });
    }
    return res.status(responseStatusCode.NOT_FOUND).json({
      status: responseStatusText.ERROR,
      message: "No product data here...!",
    });
  } catch (error) {
    console.log("🚀 ~ exports.getAllSingleProductData= ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Update product details by Admin using productId
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      productName,
      productBrand,
      productPrice,
      productMeasurement,
      productDescription,
      productWeight,
      productStyle,
      productProperties,
      productStatus,
      categoryId,
    } = req.body;
    if (req.file) {
      const { filename } = req.file;
      const updateProductDetail = {
        productName: productName,
        productBrand: productBrand,
        productPrice: productPrice,
        productMeasurement: productMeasurement,
        productDescription: productDescription,
        productWeight: productWeight,
        productStyle: productStyle,
        productProperties: productProperties,
        productStatus: productStatus,
        productImage: filename,
        categoryId: categoryId,
      };
      await productModel.updateOne(
        { _id: new mongoose.Types.ObjectId(productId) },
        { $set: updateProductDetail },
        { new: true }
      );
      return res.status(responseStatusCode.SUCCESS).json({
        status: responseStatusText.SUCCESS,
        message: "Your product details is updated successfully...!",
      });
    }
    const updateProductDetail = {
      productName: productName,
      productBrand: productBrand,
      productPrice: productPrice,
      productMeasurement: productMeasurement,
      productDescription: productDescription,
      productWeight: productWeight,
      productStyle: productStyle,
      productProperties: productProperties,
      productStatus: productStatus,
      categoryId: categoryId,
    };
    await productModel.updateOne(
      { _id: new mongoose.Types.ObjectId(productId) },
      { $set: updateProductDetail },
      { new: true }
    );
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      message: "Your product details is updated successfully...!",
    });
  } catch (error) {
    console.log("🚀 ~ exports.updateProduct= ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Update product status by Admin using productId (if status false then don't show in Frontend)
exports.updateProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const { status } = req.body;
    await productModel.updateOne(
      { _id: new mongoose.Types.ObjectId(productId) },
      { $set: { isDeleted: status } },
      { new: true }
    );
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      message: "Your product status is updated successfully...!",
    });
  } catch (error) {
    console.log("🚀 ~ exports.updateProductStatus= ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// Get all products of categories using categoryId
exports.getCategoryProduct = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const productData = await productModel
      .find({ categoryId: categoryId })
      .select("-__v");
    if (productData.length > 0) {
      var row = "";
      Object.keys(productData).forEach((key) => {
        row = productData[key];
        row.productImage =
          `${process.env.IMAGE_URL}/products/` + row.productImage;
      });
      return res.status(responseStatusCode.SUCCESS).json({
        status: responseStatusText.SUCCESS,
        productData,
      });
    }
    return res.status(responseStatusCode.NOT_FOUND).json({
      status: responseStatusText.ERROR,
      message: "No product data here...!",
    });
  } catch (error) {
    console.log("🚀 ~ exports.getCategoryProduct= ~ error:", error);
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};
