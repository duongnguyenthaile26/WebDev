const path = require("path");
const passport = require(path.join(__dirname, "..", "utilities", "passport"));
const User = require(path.join(__dirname, "..", "models", "user"));
const Category = require(path.join(__dirname, "..", "models", "category"));
const bcrypt = require("bcrypt");
const crypto = require("crypto");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const saltRounds = Number(process.env.SALT_ROUNDS);
const randomPasswordLength = Number(process.env.PASSWORD_LENGTH_FOR_OAUTH);

let referer;

function login(req, res, next) {
  passport.authenticate("local", function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({
        message: "login failed",
        status: "fail",
        referer: req.get("Referer"),
      });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      req.session.visited = req.tempVisited;
      return res.json({
        message: "login successful",
        status: "success",
        referer: req.get("Referer"),
      });
    });
  })(req, res, next);
}

function logout(req, res) {
  req.logout(function (error) {
    if (error) {
      return res.json({ err });
    }
    req.session.visited = req.tempVisited;
    res.json({
      status: "success",
      message: "Logout successfully",
    });
  });
}

async function register(req, res, next) {
  try {
    const { username, name, password } = req.body;
    const user = await User.findOne({ username });
    if (user === null || user === undefined) {
      const encryptedPassword = await bcrypt.hash(password, saltRounds);
      await User.create({
        username,
        name,
        password: encryptedPassword,
        role: "user",
      });
      return res.json({
        status: "success",
        message: "Register successfully",
        referer: req.get("Referer"),
      });
    } else {
      return res.json({
        status: "fail",
        message: "Username has been taken",
        referer: req.get("Referer"),
      });
    }
  } catch (error) {
    next(error);
  }
}

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

async function profile(req, res, next) {
  try {
    const user = await User.findOne({ username: req.user.username });
    const categories = await Category.find({}).select("-__v");
    const options = categories.map((category) => category.name);
    res.render("profile", {
      user,
      options,
    });
  } catch (error) {
    next(error);
  }
}

exports.login = login;
exports.logout = logout;
exports.profile = profile;
exports.register = register;
exports.callback = callback;
exports.authenticate = authenticate;
exports.successRedirect = successRedirect;
