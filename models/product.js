const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    productName: {
        type: String
    },
    productBrand: {
        type: mongoose.Types.ObjectId
    },
    productPrice: {
        type: Number
    },
    productMeasurement: {
        type: String
    },
    productDescription: {
        type: String
    },
    productWeight: {
        type: String
    },
    productStyle: {
        type: String
    },
    productProperties: {
        type: String
    },
    productImage: {
        type: String
    },
    productTags: {
        type: String
    },
    productStatus: {
        type: String,
        enum: ["outOfStock", "inStock"]
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

const productModel = mongoose.model("products", productSchema)
module.exports = productModel