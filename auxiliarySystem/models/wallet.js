const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  username: { type: String },
  balance: { type: Number, required: true, default: 0 },
});

const Wallet = mongoose.model("wallet", walletSchema);

module.exports = Wallet;
