const express = require("express");
const path = require("path");
const router = express.Router();
const passport = require(path.join(__dirname, "..", "utilities", "passport"));

const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "register"
));

router.route("/").post(passport.verifyGuest, controller.register);

module.exports = router;
