const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId
        },
        productId: {
            type: Schema.Types.ObjectId
        },
        quantity: {
            type: Number,
            default: 1,
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

const cartModel = mongoose.model("cart", cartSchema)
module.exports = cartModel