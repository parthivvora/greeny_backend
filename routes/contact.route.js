const express = require("express");
const { adminAuth } = require("../middleware/adminAuth");
const {
  contactData,
  getAllContactQueryData,
} = require("../controllers/contact.controller");
const router = express.Router();

router.post("/addContactData", contactData);
router.get("/getAllContactQueryData", adminAuth, getAllContactQueryData);

module.exports = router;
