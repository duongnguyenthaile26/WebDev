const express = require("express");
const path = require("path");
const router = express.Router();

const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "product"
));

router.route("/detail/:flagId").get(controller.detail);
router.route("/search").get(controller.search);
router.route("/type").get(controller.type);

module.exports = router;
