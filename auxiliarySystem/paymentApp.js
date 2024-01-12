const path = require("path");
const express = require("express");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const auxApiRouter = require(path.join(__dirname, "routes", "auxApi"));
const verifyToken = require(path.join(__dirname, "middlewares", "verifyToken"));
const paymentApp = express();

paymentApp.use(express.json());

paymentApp.use("/api", verifyToken, auxApiRouter);

module.exports = paymentApp;
