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

router.route("/wallet").post(controller.addWallet);

router.route("/wallet/:userId").get(controller.getWallet);

router.route("/deposit").post(controller.deposit);

router.route("/pay").post(controller.pay);

router.route("/transaction").get(controller.getAllTransaction);

module.exports = router;
