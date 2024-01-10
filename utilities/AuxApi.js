const axios = require("axios");
const https = require("https");
const jwt = require("jsonwebtoken");

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
// add wallet
async function addWallet(userId, username) {
  const token = generateToken();
  const respone = await axios.post(
    "https://127.0.0.1:8000/api/wallet",
    { userId, username },
    {
      headers: { Authorization: `Bearer ${token}` },
      httpsAgent,
    }
  );
  return respone.data.wallet;
}
// get wallet
async function getWallet(userId) {
  const token = generateToken();
  const respone = await axios.get(
    `https://127.0.0.1:8000/api/wallet/?userId=${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      httpsAgent,
    }
  );

  return respone.data.wallet;
}

exports.addWallet = addWallet;
exports.getWallet = getWallet;
