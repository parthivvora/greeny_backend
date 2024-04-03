const joi = require("joi")

exports.userRegisterValidation = joi.object({
    name: joi.string().required(),
    email: joi.string().email().lowercase().required(),
    password: joi.string().alphanum().required(),
    contact: joi.number().max(9999999999).required(),
})

exports.userLoginValidation = joi.object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().alphanum().required(),
})