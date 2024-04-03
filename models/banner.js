const mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema(
    {
        bannerTitle: {
            type: String
        },
        bannerDescription: {
            type: String
        },
        bannerImage: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

const bannerModel = mongoose.model("banners", bannerSchema)
module.exports = bannerModel