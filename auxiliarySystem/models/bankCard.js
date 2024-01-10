const mongoose = require("mongoose");

const bankCardSchema = new mongoose.Schema({
  method: { type: String, required: true },
  id: { type: String, required: true, uniqued: true },
  holder: { type: String, required: true },
  issue_date: {
    type: String,
    required: true,
    match: /^(01|02|03|04|05|06|07|08|09|10|11|12)\/[0-9]{2,2}$/,
  },
  cvv: {
    type: String,
    required: true,
    match: /^\d{3,4}$/,
  },
});
const BankCard = mongoose.model("bankCard", bankCardSchema);

module.exports = BankCard;
