const mongoose = require("mongoose");
const path = require("path");
const { stringify } = require("querystring");
const BankCard = require(path.join(__dirname, "..", "models", "bankCard"));
const Transaction = require(path.join(
  __dirname,
  "..",
  "models",
  "transaction"
));
const Wallet = require(path.join(__dirname, "..", "models", "wallet"));

function test(req, res, next) {
  res.json({
    status: "success",
    statusCode: 200,
    message: "Test success",
    data: req.decoded,
  });
}

async function getWallet(req, res, next) {
  try {
    const id = req.query.userId;
    if (typeof id !== "string" || id.length !== 24) {
      return res.json({
        status: "fail",
        statusCode: 404,
        message: "Invalid Id",
      });
    }
    const wallet = await Wallet.find({ userId: id }).select(
      "-_id -username -__v"
    );
    if (!wallet.length) {
      return res.json({
        status: "fail",
        statusCode: 404,
        message: "Wallet Not Found",
      });
    }

    return res.json({
      status: "success",
      statusCode: 200,
      message: "Get wallet cuccessfully",
      wallet: wallet[0],
    });
  } catch (error) {
    next(error);
  }
}
async function addWallet(req, res, next) {
  try {
    const userId = req.body.userId;
    const username = req.body.username;
    const walletExist = await Wallet.find({ userId });
    if (walletExist.length) {
      return res.json({ status: "fail", message: "Wallet already exist" });
    }
    const wallet = await Wallet.create({ userId, username, balance: 0 });
    res.json({
      status: "success",
      message: "Add new wallet successfully",
      wallet,
    });
  } catch (error) {
    next(error);
  }
}
function deposit(req, res, next) {}
function pay(req, res, next) {}
function getTransaction(req, res, next) {}

exports.test = test;
exports.getWallet = getWallet;
exports.addWallet = addWallet;
exports.deposit = deposit;
exports.pay = pay;
exports.getTransaction = getTransaction;
