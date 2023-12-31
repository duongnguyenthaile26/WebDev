const express = require("express");
const path = require("path");
const router = express.Router();

const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "checkout"
));

router.route("/cart").get(controller.cart);
router.route("/payment").get(controller.payment);

module.exports = router;
