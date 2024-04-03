const joi = require("joi")

exports.categoryValidation = joi.object({
    categoryName: joi.string().required()
})