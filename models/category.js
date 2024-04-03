const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema(
    {
        categoryName: {
            type: String
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const categoryModel = mongoose.model("category", categorySchema)
module.exports = categoryModel