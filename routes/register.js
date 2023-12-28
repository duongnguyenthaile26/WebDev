const express = require("express");
const path = require("path");
const router = express.Router();

const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "register"
));

router.route("/").post(controller.register);

module.exports = router;
