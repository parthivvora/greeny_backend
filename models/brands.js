const mongoose = require("mongoose")

const brandsSchema = new mongoose.Schema(
    {
        brandName: {
            type: String
        },
        totalItems: {
            type: Number
        },
        brandImage: {
            type: String,
        },
        brandStatus: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

const brandsModel = mongoose.model("brands", brandsSchema)
module.exports = brandsModel