const express = require("express");
const path = require("path");
const router = express.Router();

const controller = require(path.join(__dirname, "..", "controllers", "login"));

router.route("/").post(controller.login);

module.exports = router;
