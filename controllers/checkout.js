const path = require("path");
const Flag = require(path.join(__dirname, "..", "models", "flag"));
const Category = require(path.join(__dirname, "..", "models", "category"));
const User = require(path.join(__dirname, "..", "models", "user"));
const axios = require("axios");
const https = require("https");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const iss = process.env.ISSUER;
const aud = process.env.AUDIENCE;

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

function generateToken() {
  const payload = {
    iss,
    aud,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };
  return jwt.sign(payload, process.env.JWT_SECRET);
}

async function payment(req, res, next) {
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

exports.payment = payment;
exports.cart = cart;
exports.removeItem = removeItem;
