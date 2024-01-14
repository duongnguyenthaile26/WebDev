const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  balance: { type: Number, required: true, default: 0 },
});

const Wallet = mongoose.model("wallet", walletSchema);

module.exports = Wallet;
