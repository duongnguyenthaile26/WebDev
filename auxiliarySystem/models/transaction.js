const mongoose = require("mongoose");

const transactionchema = new mongoose.Schema({
  createDate: { type: Date, required: true },
  command: {
    type: String,
    required: true,
    enum: ["deposit", "pay"],
    default: "pay",
  },
  amount: { type: Number, require: true },
  content: { type: String },
  username: { type: String, require: true, unique: true },
});
const Transaction = mongoose.model("transaction", transactionchema);

module.exports = Transaction;
