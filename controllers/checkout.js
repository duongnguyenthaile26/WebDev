const path = require("path");
const Flag = require(path.join(__dirname, "..", "models", "flag"));
const Category = require(path.join(__dirname, "..", "models", "category"));
const User = require(path.join(__dirname, "..", "models", "user"));
const AuxApi = require(path.join(__dirname, "..", "utilities", "AuxApi"));
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

async function cart(req, res, next) {
  try {
    // cho sidebar
    const categories = await Category.find({}).select("-__v");
    const options = categories.map((category) => category.name);

    const user = await User.findOne({ username: req.user.username });
    const flags = [];
    let total = 0;
    for (let i = 0; i < user.cart.length; i++) {
      const flag = { quantity: user.cart[i].quantity };
      const flagInfo = await Flag.findOne({ _id: user.cart[i].flagID }).select(
        "-__v"
      );
      flag.name = flagInfo.name;
      flag.price = flagInfo.price;
      flag.image = flagInfo.image;
      flag.type = flagInfo.type;
      flag.totalPrice = flag.price * flag.quantity;
      flag._id = flagInfo._id;
      total += flag.totalPrice;
      flags.push(flag);
    }

    total = total.toFixed(2);
    const itemsPerPage = 5; // Số lượng sản phẩm trên mỗi trang
    const page = req.query.page || 1;

    const totalItems = flags.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Lấy phần của danh sách sản phẩm tương ứng với trang hiện tại
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const flagsOnPage = flags.slice(startIndex, endIndex);

    /* Nhớ làm thêm nút để xóa item ra khỏi giỏ hàng nha */

    res.render("cart", {
      user: req.user, // cái này để đi đến trang người dùng (khi nào có thì cài đặt sau)
      options, // cho sidebar
      flags: flagsOnPage,
      total, // tổng giá tiền của cả giỏ hàng
      totalPages: totalPages,
      currentPage: page,
      totalInCart: user.cart.length,
    });
  } catch (error) {
    next(error);
  }
}

async function removeItem(req, res, next) {
  try {
    const user = await User.findOne({ username: req.user.username });
    const { mode } = req.body;
    if (mode === "item") {
      const { flagID } = req.body;
      user.cart = user.cart.filter((item) => item.flagID !== flagID);
    } else if (mode === "cart") {
      user.cart = [];
    }
    user.markModified("cart");
    user.save().then(function () {
      res.json({ status: "success" });
    });
  } catch (error) {
    next(error);
  }
}

async function payment(req, res, next) {
  try {
    const data = await AuxApi.pay(req.body.amount, req.user.username);
    if (data.status === "fail") {
      return res.json(data);
    }
    const transaction = data.transaction;
    const user = await User.findOne({ username: req.user.username });
    const flags = [];
    for (let i = 0; i < user.cart.length; i++) {
      const flag = { quantity: user.cart[i].quantity };
      const flagInfo = await Flag.findOne({ _id: user.cart[i].flagID }).select(
        "-__v"
      );
      flag.name = flagInfo.name;
      flag.price = flagInfo.price;
      flag.totalPrice = flag.price * flag.quantity;
      flags.push(flag);
    }
    const total = Number(transaction.amount);

    //TODO: send order to user email
    const order = {
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      createDate: transaction.createDate,
      transactionId: transaction._id,
      total: total,
      flags: flags,
    };
    user.orderList.push(order);

    user.cart = [];
    user.markModified("orderList");
    user.markModified("cart");
    console.log(user);
    await user.save();
    res.json({ status: "success" });
  } catch (error) {
    next(error);
  }
}

async function deposit(req, res, next) {
  try {
    const bankCard = req.body.bankCard;
    const amount = req.body.amount;
    const username = req.user.username;
    const data = await AuxApi.deposit(amount, bankCard, username);
    if (data.status === "fail") {
      return res.json(data);
    }

    res.json({
      status: "success",
      message: data.message,
      balance: data.balance,
    });
  } catch (error) {
    next(error);
  }
}

async function getBalance(req, res, next) {
  try {
    console.log(req.user);
    let wallet = null;
    const dataGetWallet = await AuxApi.getWallet(req.user.username);
    if (
      dataGetWallet.status === "fail" &&
      dataGetWallet.message === "Wallet Not Found"
    ) {
      const dataAddWallet = await AuxApi.addWallet(req.user.username);
      if (dataAddWallet.status === "success") {
        wallet = dataAddWallet.wallet;
      }
    } else if (dataGetWallet.status === "success") {
      wallet = dataGetWallet.wallet;
    }
    console.log(wallet);
    if (!wallet) {
      return res.json({
        status: "fail",
        message: "get balance failed",
        balance: -1,
      });
    }
    res.json({
      status: "success",
      message: "get balance successfully",
      balance: wallet.balance,
    });
  } catch (error) {
    next(error);
  }
}
async function purchaseHistory(req, res, next) {
  try {
    const user = await User.findOne({ username: req.user.username });
    const categories = await Category.find({}).select("-__v");
    const options = categories.map((category) => category.name);
    const data = await AuxApi.pay(req.body.amount, req.user.username); 
    const transaction = data.transaction;
    const flags = [];
    for (let i = 0; i < user.cart.length; i++) {
      const flag = { quantity: user.cart[i].quantity };
      const flagInfo = await Flag.findOne({ _id: user.cart[i].flagID }).select(
        "-__v"
      );
      flag.name = flagInfo.name;
      flag.price = flagInfo.price;
      flag.totalPrice = flag.price * flag.quantity;
      flags.push(flag);
    }
    const total = Number(transaction.amount);
    /*
    trong hàm payment dòng 101
    orderList:{
      name: 
      address: 
      email: 
      phone: 
      createDate: transaction.createDate, kiểu Date
      transactionId: transaction._id,
      total: total,
      flags: [
        {name,quantity,totalPrice,price}
        kệ cái price, hiện totalPrice
      ]
    }
    */
    const orderList = {
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      createDate: transaction.createDate,
      transactionId: transaction._id,
      total: total,
      flags: flags,
    };
    res.render("purchaseHistory", { 
      user: req.user,
      orderList: orderList,
      options,
    });
  } catch (error) {
    next(error);
  }
}

exports.cart = cart;
exports.removeItem = removeItem;
exports.payment = payment;
exports.deposit = deposit;
exports.getBalance = getBalance;
exports.purchaseHistory = purchaseHistory;
