const path = require("path");
const passport = require(path.join(__dirname, "..", "utilities", "passport"));
const User = require(path.join(__dirname, "..", "models", "user"));
const Category = require(path.join(__dirname, "..", "models", "category"));
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const AppError = require(path.join(__dirname, "..", "utilities", "AppError"));
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const saltRounds = Number(process.env.SALT_ROUNDS);
const randomPasswordLength = Number(process.env.PASSWORD_LENGTH_FOR_OAUTH);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SERVER_MAIL,
    pass: process.env.SERVER_MAIL_PASSWORD,
  },
});

let referer;
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const verifyTokenLength = 16;

async function generateVerifyToken() {
  try {
    let verifyToken = "";
    for (let i = 0; i < verifyTokenLength; i++) {
      verifyToken += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    const encryptedVerifyToken = await bcrypt.hash(verifyToken, saltRounds);
    return [verifyToken, encryptedVerifyToken];
  } catch (error) {
    throw error;
  }
}

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
    const { username, name, password, mail } = req.body;
    if (mail === process.env.SERVER_MAIL) {
      return res.json({
        status: "fail",
        message: "Forbidden mail",
        referer: req.get("Referer"),
      });
    }
    const userByUsername = await User.findOne({ username });
    const userByMail = await User.findOne({ mail });
    if (
      (userByUsername === null || userByUsername === undefined) &&
      (userByMail === null || userByMail === undefined)
    ) {
      const encryptedPassword = await bcrypt.hash(password, saltRounds);
      const [verifyToken, encryptedVerifyToken] = await generateVerifyToken();
      const mailOptions = {
        from: process.env.SERVER_MAIL,
        to: mail,
        subject: "Flagbay Account Confirmation",
        html: `<p>Please click <a href="https://127.0.0.1:${process.env.PORT}/account/verifyAccount?mail=${mail}&token=${verifyToken}">here</a> to verify your account on Flagbay.</p>`,
      };
      await transporter.sendMail(mailOptions);
      await User.create({
        username,
        name,
        mail,
        verified: false,
        verifyToken: encryptedVerifyToken,
        password: encryptedPassword,
        role: "user",
      });
      return res.json({
        status: "success",
        message: "Register successfully, please verify your mail",
        referer: req.get("Referer"),
      });
    } else {
      return res.json({
        status: "fail",
        message: userByUsername
          ? "Username has been taken"
          : "Mail has been used for another account",
        referer: req.get("Referer"),
      });
    }
  } catch (error) {
    next(error);
  }
}

async function verifyAccount(req, res, next) {
  try {
    const { token, mail } = req.query;
    const userByMail = await User.findOne({ mail });
    if (userByMail === null || userByMail === undefined) {
      return next(new AppError(`Verify mail does not exists`, 404));
    }
    if (userByMail.verified) {
      return next(new AppError(`Mail already verified`, 401));
    }
    const match = await bcrypt.compare(token, userByMail.verifyToken);
    if (!match) {
      return next(new AppError(`Invalid verify token`, 401));
    } else {
      userByMail.verifyToken = "0";
      userByMail.verified = true;
      userByMail.markModified("verified");
      userByMail.markModified("verifyToken");
      userByMail.save();
      res.redirect("/");
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
    const user = await User.findOne({ mail: req.user.mail });
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
        mail: req.user.mail,
        role: "user",
        verified: true,
        verifyToken: "0",
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
exports.verifyAccount = verifyAccount;
