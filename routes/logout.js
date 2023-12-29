const express = require("express");
const path = require("path");
const router = express.Router();
const verifyRole = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "verifyRole"
));

const controller = require(path.join(__dirname, "..", "controllers", "logout"));

router.route("/").get(verifyRole.verifyUser, controller.logout);

module.exports = router;
