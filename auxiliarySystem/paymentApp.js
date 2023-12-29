const path = require("path");
const express = require("express");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const paymentApp = express();

paymentApp.use(express.json());

async function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    jwt.verify(token, process.env.JWT_SECRET, function (error, decoded) {
      console.log(decoded);
    });
    req.user = decoded;
  } catch (error) {
    return res.status(401).send("Invalid Token");
  }
  return next();
}

paymentApp.post("/api/test", verifyToken, (req, res) => {
  res.send("Data received and processed");
});

module.exports = paymentApp;
