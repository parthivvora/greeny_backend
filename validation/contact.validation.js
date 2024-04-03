const joi = require("joi")

exports.contactValidation = joi.object({
    name: joi.string().required(),
    email: joi.string().email().lowercase().required(),
    message: joi.string().required(),
})