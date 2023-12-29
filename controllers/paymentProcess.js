const path = require("path");
const axios = require("axios");
const https = require("https");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

async function test(req, res, next) {
  try {
    const payload = { user: req.user };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24 * 365,
    });
    const response = await axios.post(
      "https://127.0.0.1:8000/api/test",
      {
        message: "Hello World",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        httpsAgent,
      }
    );
    res.json(response.data);
  } catch (error) {
    next(error);
  }
}

exports.test = test;
