const express = require("express");
const path = require("path");
const router = express.Router();
const passport = require(path.join(__dirname, "..", "utilities", "passport"));

const controller = require(path.join(__dirname, "..", "controllers", "logout"));

router.route("/").get(passport.verifyUser, controller.logout);

module.exports = router;
