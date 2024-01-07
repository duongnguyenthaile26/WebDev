const path = require("path");
const VisitorCount = require(path.join(
  __dirname,
  "..",
  "models",
  "visitorCount"
));
const User = require(path.join(__dirname, "..", "models", "user"));

async function visitorData(req, res, next) {
  try {
    const data = await VisitorCount.find()
      .sort({ date: -1 })
      .limit(7)
      .select("-_id -__v");
    res.json({ status: "success", data });
  } catch (error) {
    next(error);
  }
}

async function addToCart(req, res, next) {
  try {
    const username = req.user.username;
    const { flagID, quantity: quantityString } = req.body;
    const quantity = Number(quantityString);

    const user = await User.findOne({ username });

    const itemIndex = user.cart.findIndex((item) => item.flagID === flagID);

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += quantity;
    } else {
      user.cart.push({ flagID, quantity: quantity });
    }

    user.markModified("cart");
    await user.save();

    res.json({ status: "success" });
  } catch (error) {
    next(error);
  }
}

exports.visitorData = visitorData;
exports.addToCart = addToCart;
