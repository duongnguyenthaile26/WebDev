const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const crypto = require("crypto");

const controller = require(path.join(
  __dirname,
  "..",
  "controllers",
  "product"
));
const verifyRole = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "verifyRole"
));
const flagManagement = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "flagManagement"
));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "public", "flags"));
  },
  filename: function (req, file, cb) {
    const fileName = crypto.randomUUID() + path.extname(file.originalname);
    req.fileName = fileName;
    cb(null, fileName);
  },
});
const upload = multer({ storage, limits: 1048576 });

router
  .route("/detail/:flagId")
  .get(controller.detail)
  .delete(controller.deleteFlag);
router.route("/search").get(controller.search);
router.route("/type").get(controller.type);
router.route("/addToCart").post(verifyRole.checkUser, controller.addToCart);
router
  .route("/addFlag")
  .get(verifyRole.checkAdmin, controller.addFlagView)
  .post(
    verifyRole.checkAdmin,
    upload.single("image"),
    flagManagement.verifyFlagInfo,
    controller.addFlag
  );
router
  .route("/editFlag/:flagId")
  .get(verifyRole.checkAdmin, controller.editFlagView)
  .post(
    verifyRole.checkAdmin,
    upload.any("image"),
    flagManagement.verifyFlagInfo,
    controller.editFlag
  );

module.exports = router;
