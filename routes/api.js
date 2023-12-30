const express = require("express");
const path = require("path");
const router = express.Router();

const controller = require(path.join(__dirname, "..", "controllers", "api"));
const verifyRole = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "verifyRole"
));

router.route("/visitorData").post(controller.visitorData);
router.route("/addToCart").post(verifyRole.verifyUser, controller.addToCart);

module.exports = router;
