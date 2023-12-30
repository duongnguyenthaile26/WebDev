const express = require("express");
const path = require("path");
const router = express.Router();
const verifyRole = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "verifyRole"
));

const controller = require(path.join(__dirname, "..", "controllers", "admin_userMangement"));

router.route("/").get(controller.render);

module.exports = router;
