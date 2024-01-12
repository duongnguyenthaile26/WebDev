const express = require("express");
const path = require("path");
const router = express.Router();

const controller = require(path.join(__dirname, "..", "controllers", "admin"));

router
  .route("/userManagement")
  .get(controller.userManagement)
  .delete(controller.removeUser);
router
  .route("/categoryManagement")
  .get(controller.categoryManagement)
  .patch(controller.changeName)
  .delete(controller.removeCategory)
  .post(controller.addCategory);

router.route("/transaction").get(controller.transaction);

module.exports = router;
