const express = require("express");
const path = require("path");
const router = express.Router();

const controller = require(path.join(__dirname, "..", "controllers", "api"));

router.route("/visitorData").post(controller.visitorData);

module.exports = router;
