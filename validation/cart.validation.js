const joi = require("joi")

exports.cartValidation = joi.object({
    productId: joi.string().required(),
    quantity: joi.number().required(),
})