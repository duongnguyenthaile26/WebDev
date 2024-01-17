const axios = require("axios");
const https = require("https");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const iss = process.env.ISSUER;
const aud = process.env.AUDIENCE;
const PORT = process.env.AUX_PORT;

function generateToken() {
  const payload = {
    iss,
    aud,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };
  return jwt.sign(payload, process.env.JWT_SECRET);
}

async function addWallet(username) {
  const token = generateToken();
  const response = await axios.post(
    `https://127.0.0.1:${PORT}/api/wallet`,
    { username },
    {
      headers: { Authorization: `Bearer ${token}` },
      httpsAgent,
    }
  );
  return response.data;
}

async function getWallet(username) {
  const token = generateToken();
  const response = await axios.get(
    `https://127.0.0.1:${PORT}/api/wallet/${username}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      httpsAgent,
    }
  );
  return response.data;
}

async function deposit(amount, bankCard, username, transactionID) {
  const token = generateToken();
  const response = await axios.post(
    `https://127.0.0.1:${PORT}/api/deposit`,
    { amount, bankCard, username, transactionID },
    {
      headers: { Authorization: `Bearer ${token}` },
      httpsAgent,
    }
  );
  return response.data;
}

async function pay(amount, username, transactionID) {
  const token = generateToken();
  const response = await axios.post(
    `https://127.0.0.1:${PORT}/api/pay`,
    { amount, username, transactionID },
    {
      headers: { Authorization: `Bearer ${token}` },
      httpsAgent,
    }
  );
  return response.data;
}

async function undo(transactionID) {
  const token = generateToken();
  const response = await axios.post(
    `https://127.0.0.1:${PORT}/api/undo`,
    { transactionID },
    {
      headers: { Authorization: `Bearer ${token}` },
      httpsAgent,
    }
  );
  return response.data;
}

async function getAllTransaction() {
  const token = generateToken();
  const response = await axios.get(
    `https://127.0.0.1:${PORT}/api/transaction`,
    {
      headers: { Authorization: `Bearer ${token}` },
      httpsAgent,
    }
  );
  return response.data;
}

async function deleteWallet(username) {
  const token = generateToken();
  const response = await axios.delete(`https://127.0.0.1:${PORT}/api/wallet`, {
    headers: { Authorization: `Bearer ${token}` },
    httpsAgent,
    data: { username },
  });
  return response.data;
}

async function changeWalletName(username, newUsername) {
  const token = generateToken();
  const response = await axios.patch(
    `https://127.0.0.1:${PORT}/api/wallet`,
    { username, newUsername },
    {
      headers: { Authorization: `Bearer ${token}` },
      httpsAgent,
    }
  );
  return response.data;
}

exports.deleteWallet = deleteWallet;
exports.addWallet = addWallet;
exports.getWallet = getWallet;
exports.deposit = deposit;
exports.pay = pay;
exports.getAllTransaction = getAllTransaction;
exports.changeWalletName = changeWalletName;
exports.undo = undo;
