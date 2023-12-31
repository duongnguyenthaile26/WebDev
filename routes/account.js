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
  "account"
));

let tempVisited;

router.route("/login").post(
  verifyRole.verifyGuest,
  function (req, res, next) {
    req.tempVisited = req.session.visited;
    next();
  },
  controller.login
);

router.route("/logout").post(
  verifyRole.verifyLoggedIn,
  function (req, res, next) {
    req.tempVisited = req.session.visited;
    next();
  },
  controller.logout
);

router.route("/register").post(verifyRole.verifyGuest, controller.register);

router.route("/googleAuth").get(
  verifyRole.verifyGuest,
  function (req, res, next) {
    tempVisited = req.session.visited;
    next();
  },
  controller.authenticate
);

router.route("/googleAuth/callback").get(
  verifyRole.verifyGuest,
  function (req, res, next) {
    req.tempVisited = tempVisited;
    next();
  },
  controller.callback,
  controller.successRedirect
);

module.exports = router;
