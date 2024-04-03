const multer = require("multer")
const path = require("path")
const { v4: uuidv4 } = require("uuid")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = path.join(__dirname, "../public/user/")
        cb(null, destinationPath)
    },
    filename: (req, file, cb) => {
        const extension = file.originalname.split('.').pop();
        const filename = `${uuidv4()}.${extension}`;
        cb(null, filename);
    }
})

const uploadUserProfile = multer({ storage: storage })
module.exports = uploadUserProfile