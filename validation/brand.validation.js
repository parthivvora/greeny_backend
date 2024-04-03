const joi = require("joi")

exports.createBrandValidation = joi.object({
    brandName: joi.string().required(),
    totalItems: joi.number().required(),
})