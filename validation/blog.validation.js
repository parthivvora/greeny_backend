const joi = require("joi")

exports.createBlogValidation = joi.object({
    blogTitle: joi.string().required(),
    blogDescription: joi.string().required(),
})