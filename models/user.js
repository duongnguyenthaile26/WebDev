const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
  },
  verifyToken: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "guest", "admin"],
    default: "user",
  },
  cart: {
    type: Array,
    default: [],
  },
  orderList: {
    type: Array,
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
