const Joi = require("joi")
const joi = require("joi")

exports.addProductValidation = joi.object({
    productName: joi.string().required(),
    productBrand: joi.string().required(),
    productPrice: joi.number().required(),
    productMeasurement: joi.string().required(),
    productDescription: joi.string().required(),
    productWeight: joi.string().required(),
    productStyle: joi.string().required(),
    productProperties: joi.string().required(),
    productStatus: joi.string().required(),
    productTags: joi.string().required(),
    categoryId: joi.string().required(),
})