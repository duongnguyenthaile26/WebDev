const express = require("express");
const path = require("path");
const router = express.Router();

const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "paymentProcess"
));

router.route("/").get(controller.test);

module.exports = router;
