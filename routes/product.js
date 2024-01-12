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
const upload = multer({ storage });

router.route("/detail/:flagId").get(controller.detail);
router.route("/search").get(controller.search);
router.route("/type").get(controller.type);
router.route("/addToCart").post(verifyRole.checkUser, controller.addToCart);
router
  .route("/addFlag")
  .get(controller.addFlagView)
  .post(upload.any(), controller.addFlag);
router
  .route("/editFlag/:flagId")
  .get(controller.editFlagView)
  .post(controller.editFlag);

module.exports = router;
