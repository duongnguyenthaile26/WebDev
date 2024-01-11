const express = require("express");
const path = require("path");
const router = express.Router();

const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "product"
));
const verifyRole = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "verifyRole"
));

router.route("/detail/:flagId").get(controller.detail);
router.route("/search").get(controller.search);
router.route("/type").get(controller.type);
router.route("/addToCart").post(verifyRole.checkUser, controller.addToCart);
router.route("/addFlag").get(controller.addFlagView);
router.route("/editFlag/:flagId").get(controller.editFlagView);

module.exports = router;
