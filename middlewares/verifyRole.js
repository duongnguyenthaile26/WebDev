const path = require("path");
const User = require(path.join(__dirname, "..", "models", "user"));
const Category = require(path.join(__dirname, "..", "models", "category"));

function checkAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.render("denied");
}

function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

function checkNonVerifiedUser(req, res, next) {
  if (!req.isAuthenticated() || req.user.role !== "user" || req.user.verified) {
    return res.redirect("/");
  }
  next();
}

async function checkVerifiedUser(req, res, next) {
  if (!req.isAuthenticated() || req.user.role !== "user") {
    return res.redirect("/");
  }
  if (req.user.verified) {
    return next();
  }
  try {
    const user = await User.findOne({ username: req.user.username });
    const categories = await Category.find({}).select("-__v");
    const options = categories.map((category) => category.name);
    res.render("verification", {
      user,
      options,
    });
  } catch (error) {
    next(error);
  }
}

function checkUser(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "user") {
    return next();
  }
  res.redirect("/");
}

function checkGuest(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

exports.checkAdmin = checkAdmin;
exports.checkLoggedIn = checkLoggedIn;
exports.checkUser = checkUser;
exports.checkGuest = checkGuest;
exports.checkVerifiedUser = checkVerifiedUser;
exports.checkNonVerifiedUser = checkNonVerifiedUser;
