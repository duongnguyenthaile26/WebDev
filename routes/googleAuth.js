const express = require("express");
const path = require("path");
const router = express.Router();
const verifyRole = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "verifyRole"
));

const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "googleAuth"
));

router.route("/").get(verifyRole.verifyGuest, controller.authenticate);
router
  .route("/callback")
  .get(verifyRole.verifyGuest, controller.callback, controller.successRedirect);

module.exports = router;
