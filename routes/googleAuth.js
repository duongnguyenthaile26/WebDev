const express = require("express");
const path = require("path");
const router = express.Router();
const verifyRole = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "verifyRole"
));

const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "googleAuth"
));

let tempVisited;

router.route("/").get(
  verifyRole.verifyGuest,
  function (req, res, next) {
    tempVisited = req.session.visited;
    next();
  },
  controller.authenticate
);

router.route("/callback").get(
  verifyRole.verifyGuest,
  function (req, res, next) {
    req.tempVisited = tempVisited;
    next();
  },
  controller.callback,
  controller.successRedirect
);

module.exports = router;
