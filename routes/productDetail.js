const express = require("express");
const path = require("path");
const router = express.Router();

const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "productDetail"
));

router.route("/").get(controller.render);

module.exports = router;
