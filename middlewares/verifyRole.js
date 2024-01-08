const path = require("path");
const User = require(path.join(__dirname, "..", "models", "user"));
const Category = require(path.join(__dirname, "..", "models", "category"));

function verifyAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.render("denied");
}

function verifyLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

async function verifyVerifiedUser(req, res, next) {
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

function verifyUser(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "user") {
    return next();
  }
  res.redirect("/");
}

function verifyGuest(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

exports.verifyAdmin = verifyAdmin;
exports.verifyLoggedIn = verifyLoggedIn;
exports.verifyUser = verifyUser;
exports.verifyGuest = verifyGuest;
exports.verifyVerifiedUser = verifyVerifiedUser;
