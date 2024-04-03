const joi = require("joi")

exports.commentValidation = joi.object({
    name: joi.string().required(),
    email: joi.string().email().lowercase().required(),
    message: joi.string().required(),
    blogId: joi.string().required(),
})