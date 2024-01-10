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
    const id = req.params.userId;
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
    const walletExist = await Wallet.findOne({ userId });
    if (walletExist) {
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
async function deposit(req, res, next) {
  try {
    const depositAmount = req.body.amount;

    const bankCard = await BankCard.findOne(req.body.bankCard);
    if (!bankCard) {
      return res.json({ status: "fail", message: "Invalid bank information" });
    }

    if (depositAmount > bankCard.balance) {
      return res.json({ status: "fail", message: "Insufficient funds" });
    }

    const wallet = await Wallet.findOne({ userId: req.body.wallet.userId });
    if (!wallet) {
      return res.json({ status: "fail", message: "Wallet not found" });
    }

    // update wallet
    wallet.balance += depositAmount;
    await wallet.save();

    // update bankCard
    bankCard.balance -= depositAmount;
    await bankCard.save();

    const transaction = await Transaction.create({
      createDate: Date.now(),
      command: "deposit",
      amount: depositAmount,
      content: "deposit money to wallet",
      wallet: {
        userId: wallet.userId,
        username: wallet.username,
      },
    });

    await res.json({
      status: "success",
      message: "Deposit successfully",
      balance: wallet.balance,
      transaction,
    });
  } catch (error) {
    next(error);
  }
}
async function pay(req, res, next) {
  try {
    const payAmount = req.body.amount;

    const wallet = await Wallet.findOne({ userId: req.body.wallet.userId });
    if (!wallet) {
      return res.json({ status: "fail", message: "Wallet not found" });
    }
    if (payAmount > wallet.balance) {
      return res.json({ status: "fail", message: "Insufficient funds" });
    }

    // update wallet
    wallet.balance -= payAmount;
    await wallet.save();

    const transaction = await Transaction.create({
      orderId: req.body.orderId,
      createDate: Date.now(),
      command: "pay",
      amount: payAmount,
      content: "pay money on Flagbay",
      wallet: {
        userId: wallet.userId,
        username: wallet.username,
      },
    });

    await res.json({
      status: "success",
      message: "Deposit successfully",
      balance: wallet.balance,
      transaction,
    });
  } catch (error) {
    next(error);
  }
}
async function getAllTransaction(req, res, next) {
  try {
    const transactions = await Transaction.find({}).select("-__v");
    res.json({
      status: "success",
      message: "Get transaction successfully",
      transactions,
    });
  } catch (error) {
    next(error);
  }
}

exports.test = test;
exports.getWallet = getWallet;
exports.addWallet = addWallet;
exports.deposit = deposit;
exports.pay = pay;
exports.getAllTransaction = getAllTransaction;
