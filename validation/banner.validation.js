const joi = require("joi")

exports.addBannerValidation = joi.object({
    bannerTitle: joi.string().required(),
    bannerDescription: joi.string().required(),
})