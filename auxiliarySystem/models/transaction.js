const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  transactionID: { type: String, required: true },
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
const Transaction = mongoose.model("transaction", transactionSchema);

module.exports = Transaction;
