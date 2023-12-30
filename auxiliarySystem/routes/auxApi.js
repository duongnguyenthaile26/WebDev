const express = require("express");
const path = require("path");
const router = express.Router();

const verifyToken = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "verifyToken"
));
const controller = require(path.join(__dirname, "..", "controllers", "auxApi"));

router.route("/test").post(verifyToken, controller.test);

module.exports = router;
