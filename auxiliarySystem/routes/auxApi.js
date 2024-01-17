const express = require("express");
const path = require("path");
const router = express.Router();

const controller = require(path.join(__dirname, "..", "controllers", "auxApi"));

router
  .route("/wallet")
  .post(controller.addWallet)
  .delete(controller.deleteWallet)
  .patch(controller.changeWalletName);

router.route("/wallet/:username").get(controller.getWallet);

router.route("/deposit").post(controller.deposit);

router.route("/pay").post(controller.pay);

router.route("/transaction").get(controller.getAllTransaction);

router.route("/undo").post(controller.undo);

module.exports = router;
