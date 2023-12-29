const path = require("path");
const passport = require(path.join(__dirname, "..", "utilities", "passport"));
const User = require(path.join(__dirname, "..", "models", "user"));
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const saltRounds = 12;
const randomPasswordLength = 15;

function authenticate(req, res, next) {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })(req, res, next);
}

function callback(req, res, next) {
  passport.authenticate("google", { failureRedirect: "/" })(req, res, next);
}

async function successRedirect(req, res, next) {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (user === null || user === undefined) {
      const randomPassword = crypto
        .randomBytes(Math.ceil(randomPasswordLength / 2))
        .toString("hex")
        .slice(0, randomPasswordLength);
      const password = await bcrypt.hash(randomPassword, saltRounds);
      await User.create({
        username: req.user.username,
        password,
        name: req.user.name,
        role: req.user.role,
      });
    }
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}

exports.authenticate = authenticate;
exports.callback = callback;
exports.successRedirect = successRedirect;
