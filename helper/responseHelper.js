const responseStatusCode = {
    SUCCESS: 200,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
}

const responseStatusText = {
    SUCCESS: "Success",
    ERROR: "Error",
    WARNING: "Warning",
}

module.exports = { responseStatusCode, responseStatusText }