const express = require("express");
const path = require("path");
const router = express.Router();

const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "checkout"
));

router.route("/cart").get(controller.cart).delete(controller.removeItem);
router.route("/payment").post(controller.payment);
router.route("/balance").get(controller.getBalance);
router.route("/deposit").post(controller.deposit);

module.exports = router;
