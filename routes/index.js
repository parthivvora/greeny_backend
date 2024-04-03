const express = require("express");
const router = express.Router();

router.use(
  "/user",
  require("./user.route"),
  require("./cart.route"),
  require("./wishlist.route"),
  require("./comment.route"),
  require("./subscribe.route"),
  require("./contact.route"),
  require("./checkout.route"),
  require("./order.route"),
);
router.use(
  "/admin",
  require("./admin.route"),
  require("./blog.route"),
  require("./brands.route"),
  require("./banner.route"),
  require("./product.route"),
  require("./category.route")
);

module.exports = router;
