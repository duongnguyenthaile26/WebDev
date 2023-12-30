const path = require("path");
const axios = require("axios");
const https = require("https");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const iss = process.env.ISSUER;
const aud = process.env.AUDIENCE;

function generateToken() {
  const payload = {
    iss,
    aud,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };
  return jwt.sign(payload, process.env.JWT_SECRET);
}

async function test(req, res, next) {
  try {
    const token = generateToken();
    const response = await axios.post(
      "https://127.0.0.1:8000/api/test",
      { message: "Hello World" },
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
