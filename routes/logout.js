const express = require("express");
const path = require("path");
const router = express.Router();
const verifyRole = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "verifyRole"
));

const controller = require(path.join(__dirname, "..", "controllers", "logout"));

router.route("/").post(
  verifyRole.verifyUser,
  function (req, res, next) {
    req.tempVisited = req.session.visited;
    next();
  },
  controller.logout
);

module.exports = router;
