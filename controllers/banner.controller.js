const { default: mongoose } = require("mongoose")
const { responseStatusText, responseStatusCode } = require("../helper/responseHelper")
const bannerModel = require("../models/banner")
const fs = require("fs")
const { addBannerValidation } = require("../validation/banner.validation")

// Add banners by Admin
exports.addBanners = async (req, res) => {
    try {
        const { error, value } = addBannerValidation.validate(req.body)
        if (error) {
            fs.unlinkSync(req.file.path)
            return res.status(responseStatusCode.FORBIDDEN).json({
                status: responseStatusText.ERROR,
                message: error.details[0].message
            })
        }
        if (!req.file) {
            return res.status(responseStatusCode.FORBIDDEN).json({
                status: responseStatusText.ERROR,
                message: "Please, upload banner...!"
            })
        }
        const newBannerData = {
            bannerTitle: value.bannerTitle,
            bannerDescription: value.bannerDescription,
            bannerImage: req.file.filename,
        }
        bannerModel.create(newBannerData)
        return res.status(responseStatusCode.SUCCESS).json({
            status: responseStatusText.SUCCESS,
            message: "Banner data add successfully...!"
        })
    } catch (error) {
        console.log("🚀 ~ exports.addBanners= ~ error:", error)
        fs.unlinkSync(req.file.path)
        return res.status(responseStatusCode.INTERNAL_SERVER).json({
            status: responseStatusText.ERROR,
            message: error.message
        })
    }
}

// Get all banners data
exports.getAllBannerData = async (req, res) => {
    try {
        const bannerData = await bannerModel.find()
        if (bannerData.length > 0) {
            var row = ""
            Object.keys(bannerData).forEach((key) => {
                row = bannerData[key];
                row.bannerImage =
                    `${process.env.IMAGE_URL}/banners/` + row.bannerImage;
            });
            return res.status(responseStatusCode.SUCCESS).json({
                status: responseStatusText.SUCCESS,
                bannerData,
            })
        }
        return res.status(responseStatusCode.NOT_FOUND).json({
            status: responseStatusText.ERROR,
            message: "No banner data here...!"
        })
    } catch (error) {
        console.log("🚀 ~ exports.getAllBannerData= ~ error:", error)
        return res.status(responseStatusCode.INTERNAL_SERVER).json({
            status: responseStatusText.ERROR,
            message: error.message
        })
    }
}

// Update banners details by Admin using bannerId
exports.updateBanner = async (req, res) => {
    try {
        const { bannerId } = req.params
        const { bannerTitle, bannerDescription, status } = req.body
        if (req.file) {
            const { filename } = req.file
            const updateBannersDetail = {
                bannerTitle: bannerTitle,
                bannerDescription: bannerDescription,
                status: status,
                bannerImage: filename,
            }
            await bannerModel.updateOne({ _id: new mongoose.Types.ObjectId(bannerId) }, { $set: updateBannersDetail }, { new: true })
            return res.status(responseStatusCode.SUCCESS).json({
                status: responseStatusText.SUCCESS,
                message: "Your banners details is updated successfully...!",
            })
        }
        const updateBannersDetail = {
            bannerTitle: bannerTitle,
            bannerDescription: bannerDescription,
            status: status,
        }
        await bannerModel.updateOne({ _id: new mongoose.Types.ObjectId(bannerId) }, { $set: updateBannersDetail }, { new: true })
        return res.status(responseStatusCode.SUCCESS).json({
            status: responseStatusText.SUCCESS,
            message: "Your banners details is updated successfully...!",
        })
    } catch (error) {
        console.log("🚀 ~ exports.updateBanner= ~ error:", error)
        return res.status(responseStatusCode.INTERNAL_SERVER).json({
            status: responseStatusText.ERROR,
            message: error.message
        })
    }
}

// Delete banner by Admin using bannerId
exports.deleteBanner = async (req, res) => {
    try {
        const { bannerId } = req.params
        const isBannerAvailable = await bannerModel.findOne({ _id: new mongoose.Types.ObjectId(bannerId) })
        if (isBannerAvailable) {
            await bannerModel.deleteOne({ _id: new mongoose.Types.ObjectId(bannerId) })
            return res.status(responseStatusCode.SUCCESS).json({
                status: responseStatusText.SUCCESS,
                message: "Your banner is deleted successfully...!",
            })
        }
        return res.status(responseStatusCode.NOT_FOUND).json({
            status: responseStatusText.ERROR,
            message: "No banner found of your choice for delete...!",
        })
    } catch (error) {
        console.log("🚀 ~ exports.deleteBanner ~ error:", error)
        return res.status(responseStatusCode.INTERNAL_SERVER).json({
            status: responseStatusText.ERROR,
            message: error.message
        })
    }
}