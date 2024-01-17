const path = require("path");
const BankCard = require(path.join(__dirname, "..", "models", "bankCard"));
const Transaction = require(path.join(
  __dirname,
  "..",
  "models",
  "transaction"
));
const Wallet = require(path.join(__dirname, "..", "models", "wallet"));

async function getWallet(req, res, next) {
  try {
    const username = req.params.username;

    const wallet = await Wallet.findOne({ username }).select("-_id -__v");
    if (!wallet) {
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
      wallet,
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: error,
    });
    next(error);
  }
}
async function addWallet(req, res, next) {
  try {
    const username = req.body.username;
    const walletExist = await Wallet.findOne({ username });
    if (walletExist) {
      return res.json({ status: "fail", message: "Wallet already exist" });
    }
    const wallet = await Wallet.create({ username, balance: 0 });
    res.json({
      status: "success",
      message: "Add new wallet successfully",
      wallet,
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: error,
    });
    next(error);
  }
}

async function changeWalletName(req, res, next) {
  try {
    const { username, newUsername } = req.body;
    const wallet = await Wallet.findOne({ username });
    wallet.username = newUsername;
    wallet.markModified("username");
    await wallet.save();
    return res.json({
      status: "success",
      message: "Change wallet username successfully",
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: error,
    });
    next(error);
  }
}

async function deleteWallet(req, res, next) {
  try {
    const { username } = req.body;
    await Wallet.findOneAndDelete({ username });
    return res.json({
      status: "success",
      message: "Delete wallet successfully",
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: error,
    });
    next(error);
  }
}

async function deposit(req, res, next) {
  try {
    const depositAmount = Number(req.body.amount);

    const bankCard = await BankCard.findOne(req.body.bankCard);
    if (!bankCard) {
      return res.json({ status: "fail", message: "Invalid bank information" });
    }

    if (depositAmount > bankCard.balance) {
      return res.json({ status: "fail", message: "Insufficient funds" });
    }

    const wallet = await Wallet.findOne({ username: req.body.username });
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
      transactionID: req.body.transactionID,
      createDate: Date.now(),
      command: "deposit",
      amount: depositAmount,
      content: "Deposit money to wallet",
      username: wallet.username,
    });

    await res.json({
      status: "success",
      message: "Deposit successfully",
      balance: wallet.balance,
      transaction,
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: error,
    });
    next(error);
  }
}
async function pay(req, res, next) {
  try {
    const payAmount = Number(req.body.amount);
    const wallet = await Wallet.findOne({ username: req.body.username });
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
      transactionID: req.body.transactionID,
      createDate: Date.now(),
      command: "pay",
      amount: payAmount,
      content: "Pay money on Flagbay",
      username: wallet.username,
    });

    await res.json({
      status: "success",
      message: "Pay successfully",
      balance: wallet.balance,
      transaction,
    });
  } catch (error) {
    res.json({
      status: "fail",
      message: error,
    });
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
    res.json({
      status: "fail",
      message: error,
    });
    next(error);
  }
}

async function undo(req, res, next) {
  try {
    const { transactionID } = req.body;
    const transaction = await Transaction.findOne({ transactionID });
    if (!transaction) {
      return res.json({ status: "success", message: "Nothing to undo" });
    }
    let amount = transaction.amount;
    const username = transaction.username;
    if (transaction.command === "deposit") {
      amount *= -1;
    }
    const wallet = await Wallet.findOne({ username });
    wallet.balance += amount;
    wallet.markModified("balance");
    await wallet.save();
    await Transaction.findOneAndDelete({ transactionID });
    res.json({ status: "success", message: "Undo transaction success" });
  } catch (error) {
    res.json({
      status: "fail",
      message: "Cannot undo transaction",
    });
    next(error);
  }
}

exports.getWallet = getWallet;
exports.addWallet = addWallet;
exports.deposit = deposit;
exports.pay = pay;
exports.getAllTransaction = getAllTransaction;
exports.deleteWallet = deleteWallet;
exports.changeWalletName = changeWalletName;
exports.undo = undo;
