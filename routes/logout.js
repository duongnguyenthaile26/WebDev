const express = require("express");
const path = require("path");
const router = express.Router();

const controller = require(path.join(__dirname, "..", "controllers", "logout"));

router.route("/").get(controller.logout);

module.exports = router;
