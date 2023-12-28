const express = require("express");
const path = require("path");
const router = express.Router();
const passport = require(path.join(__dirname, "..", "utilities", "passport"));

const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "googleAuth"
));

router.route("/").get(passport.verifyGuest, controller.authenticate);
router
  .route("/callback")
  .get(passport.verifyGuest, controller.callback, controller.successRedirect);

module.exports = router;
