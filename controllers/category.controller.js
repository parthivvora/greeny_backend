const { default: mongoose } = require("mongoose")
const { responseStatusText, responseStatusCode } = require("../helper/responseHelper")
const categoryModel = require("../models/category")
const { categoryValidation } = require("../validation/category.validation")

// Add category by Admin
exports.addCategory = async (req, res) => {
    try {
        const { error, value } = categoryValidation.validate(req.body)
        if (error) {
            return res.status(responseStatusCode.FORBIDDEN).json({
                status: responseStatusText.ERROR,
                message: error.details[0].message
            })
        }
        categoryModel.create(value)
        return res.status(responseStatusCode.SUCCESS).json({
            status: responseStatusText.SUCCESS,
            message: "Category add successfully...!"
        })
    } catch (error) {
        console.log("🚀 ~ exports.addCategory= ~ error:", error)
        return res.status(responseStatusCode.INTERNAL_SERVER).json({
            status: responseStatusText.ERROR,
            message: error.message
        })
    }
}

// Get all category data
exports.getAllCategoryData = async (req, res) => {
    try {
        const categoryData = await categoryModel.find().select("_id categoryName isDeleted")
        if (categoryData.length > 0) {
            return res.status(responseStatusCode.SUCCESS).json({
                status: responseStatusText.SUCCESS,
                categoryData,
            })
        }
        return res.status(responseStatusCode.NOT_FOUND).json({
            status: responseStatusText.ERROR,
            message: "No category data here...!"
        })
    } catch (error) {
        console.log("🚀 ~ exports.getAllCategoryData= ~ error:", error)
        return res.status(responseStatusCode.INTERNAL_SERVER).json({
            status: responseStatusText.ERROR,
            message: error.message
        })
    }
}

// Update category details by Admin using categoryId
exports.updateCategory = async (req, res) => {
    console.log(req.body);
    try {
        const { categoryId } = req.params
        const { categoryName, status } = req.body

        await categoryModel.updateOne({ _id: new mongoose.Types.ObjectId(categoryId) }, { $set: { categoryName: categoryName, isDeleted: status } }, { new: true })
        return res.status(responseStatusCode.SUCCESS).json({
            status: responseStatusText.SUCCESS,
            message: "Your category details is updated successfully...!",
        })
    } catch (error) {
        console.log("🚀 ~ exports.updateCategory= ~ error:", error)
        return res.status(responseStatusCode.INTERNAL_SERVER).json({
            status: responseStatusText.ERROR,
            message: error.message
        })
    }
}

// Update category status by Admin using categoryId
exports.updateCategoryStatus = async (req, res) => {
    try {
        const { categoryId } = req.params
        const { status } = req.body

        await categoryModel.updateOne({ _id: new mongoose.Types.ObjectId(categoryId) }, { $set: { isDeleted: status } }, { new: true })
        return res.status(responseStatusCode.SUCCESS).json({
            status: responseStatusText.SUCCESS,
            message: "Your category status is updated successfully...!",
        })
    } catch (error) {
        console.log("🚀 ~ exports.updateCategoryStatus= ~ error:", error)
        return res.status(responseStatusCode.INTERNAL_SERVER).json({
            status: responseStatusText.ERROR,
            message: error.message
        })
    }
}