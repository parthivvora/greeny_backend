const jwt = require("jsonwebtoken");
const { responseStatusCode, responseStatusText } = require("../helper/responseHelper");

exports.userAuth = (req, res, next) => {
    try {
        if (!req.headers.authorization || req.headers.authorization.split(" ")[0] != "Bearer") {
            return res.status(responseStatusCode.UNAUTHORIZED).json({
                status: responseStatusText.ERROR,
                message: "Please, provide token...!"
            })
        }
        jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                return res.status(responseStatusCode.FORBIDDEN).json({
                    status: responseStatusText.ERROR,
                    message: err.message
                })
            }
            req.userId = payload.userId;
            next()
        })
    } catch (error) {
        console.log("🚀 ~ file: userAuth.js:24 ~ error:", error)
        return res.status(responseStatusCode.INTERNAL_SERVER).json({
            status: responseStatusText.ERROR,
            message: err.message
        })
    }
}