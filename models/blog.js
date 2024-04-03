const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema(
    {
        blogTitle: {
            type: String
        },
        blogDescription: {
            type: String
        },
        blogDate: {
            type: Date,
            default: Date.now()
        },
        blogImage: {
            type: String,
        },
        blogStatus: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

const blogModel = mongoose.model("blogs", blogSchema)
module.exports = blogModel