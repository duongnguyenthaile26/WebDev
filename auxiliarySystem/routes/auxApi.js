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

router.route("/wallet").post(controller.addWallet).get(controller.getWallet);

router.route("/deposit").post(controller.deposit);
router.route("/pay").post(controller.pay);

router.route("/transaction").get(controller.getTransaction);
module.exports = router;
