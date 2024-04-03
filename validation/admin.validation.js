const joi = require("joi")

exports.adminLoginValidation = joi.object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().alphanum().required(),
})