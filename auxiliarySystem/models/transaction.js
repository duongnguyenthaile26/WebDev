const mongoose = require("mongoose");

const transactionchema = new mongoose.Schema({
  orderId: { type: String },
  createDate: { type: Date, required: true },
  command: {
    type: String,
    required: true,
    enum: ["deposit", "pay"],
    default: "pay",
  },
  amount: { type: Number, require: true },
  content: { type: String },
  username: { type: String, require: true },
});
const Transaction = mongoose.model("transaction", transactionchema);

module.exports = Transaction;
