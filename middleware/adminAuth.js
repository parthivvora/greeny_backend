const jwt = require("jsonwebtoken");
const { responseStatusCode, responseStatusText } = require("../helper/responseHelper");

exports.adminAuth = (req, res, next) => {
    try {
        if (!req.headers.authorization || req.headers.authorization.split(" ")[0] != "Bearer") {
            return res.status(responseStatusCode.UNAUTHORIZED).json({
                status: responseStatusText.ERROR,
                message: "Please, provide admin token...!"
            })
        }
        jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                return res.status(responseStatusCode.FORBIDDEN).json({
                    status: responseStatusText.ERROR,
                    message: err.message
                })
            }
            req.adminId = payload.adminId;
            next()
        })
    } catch (error) {
        console.log("🚀 ~ file: adminAuth.js:23 ~ error:", error)
        return res.status(responseStatusCode.INTERNAL_SERVER).json({
            status: responseStatusText.ERROR,
            message: err.message
        })
    }
}