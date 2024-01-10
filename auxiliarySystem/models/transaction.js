const mongoose = require("mongoose");

const transactionchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  createDate: { type: Date, required: true },
  command: {
    type: String,
    required: true,
    enum: ["deposit", "pay"],
    default: "pay",
  },
  wallet: {},
});
const Transaction = mongoose.model("transaction", transactionchema);

module.exports = Transaction;
