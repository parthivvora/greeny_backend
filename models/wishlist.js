const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const wishlistSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId
        },
        productId: {
            type: Schema.Types.ObjectId
        },
        isDeleted: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
)

const wishlistModel = mongoose.model("wishlist", wishlistSchema)
module.exports = wishlistModel