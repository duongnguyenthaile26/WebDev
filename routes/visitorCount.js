const express = require("express");
const path = require("path");
const router = express.Router();

const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "visitorCount"
));

router.route("/").post(controller.getData);

module.exports = router;
