const express = require("express");
const path = require("path");
const router = express.Router();
const verifyRole = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "verifyRole"
));

const controller = require(path.join(__dirname, "..", "controllers", "login"));

router.route("/").post(
  verifyRole.verifyGuest,
  function (req, res, next) {
    req.tempVisited = req.session.visited;
    next();
  },
  controller.login
);

module.exports = router;
