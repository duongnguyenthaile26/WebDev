const mongoose = require("mongoose");

const VisitorCountSchema = new mongoose.Schema({
  count: {
    type: Number,
    required: true,
    default: 1,
  },
  date: {
    type: String,
    required: true,
    unique: true,
  },
});

const VisitorCount = mongoose.model("VisitorCount", VisitorCountSchema);

module.exports = VisitorCount;
