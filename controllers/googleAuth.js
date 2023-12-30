const path = require("path");
const passport = require(path.join(__dirname, "..", "utilities", "passport"));
const User = require(path.join(__dirname, "..", "models", "user"));
const bcrypt = require("bcrypt");
const crypto = require("crypto");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const saltRounds = process.env.SALT_ROUNDS;
const randomPasswordLength = process.env.PASSWORD_LENGTH_FOR_OAUTH;

let referer;

function authenticate(req, res, next) {
  referer = req.get("Referer");
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
    req.session.visited = req.tempVisited;
    res.redirect(referer);
  } catch (error) {
    next(error);
  }
}

exports.authenticate = authenticate;
exports.callback = callback;
exports.successRedirect = successRedirect;
