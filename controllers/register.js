const path = require("path");
const bcrypt = require("bcrypt");
const User = require(path.join(__dirname, "..", "models", "user"));
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const saltRounds = process.env.SALT_ROUNDS;

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

exports.register = register;
