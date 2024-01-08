const express = require("express");
const path = require("path");
const router = express.Router();
const googleAuthRouter = express.Router();

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
  verifyRole.checkGuest,
  function (req, res, next) {
    req.tempVisited = req.session.visited;
    next();
  },
  controller.login
);
router.route("/logout").post(
  verifyRole.checkLoggedIn,
  function (req, res, next) {
    req.tempVisited = req.session.visited;
    next();
  },
  controller.logout
);
router.route("/register").post(verifyRole.checkGuest, controller.register);
router.route("/verifyAccount").get(controller.verifyAccount);
router.route("/profile").get(verifyRole.checkLoggedIn, controller.profile);
router.route("/modify").patch(verifyRole.checkLoggedIn, controller.modify);
router
  .route("/resendMail")
  .post(verifyRole.checkNonVerifiedUser, controller.resendMail);

router.use("/googleAuth", googleAuthRouter);
googleAuthRouter.route("/").get(
  verifyRole.checkGuest,
  function (req, res, next) {
    tempVisited = req.session.visited;
    next();
  },
  controller.authenticate
);
googleAuthRouter.route("/callback").get(
  verifyRole.checkGuest,
  function (req, res, next) {
    req.tempVisited = tempVisited;
    next();
  },
  controller.callback,
  controller.successRedirect
);

module.exports = router;
