const path = require("path");
const express = require("express");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const auxApiRouter = require(path.join(__dirname, "routes", "auxApi"));

const paymentApp = express();

paymentApp.use(express.json());

paymentApp.use("/api", auxApiRouter);

module.exports = paymentApp;
