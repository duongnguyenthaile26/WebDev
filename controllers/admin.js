const path = require("path");
const Flag = require(path.join(__dirname, "..", "models", "flag"));
const Category = require(path.join(__dirname, "..", "models", "category"));
const User = require(path.join(__dirname, "..", "models", "user"));

async function userManagement(req, res, next) {
  try {
    // cho sidebar
    const categories = await Category.find({}).select("-__v");
    const options = categories.map((category) => category.name);

    // danh sách người dùng
    const users = await User.find({ role: { $ne: "admin" } }).select(
      "-password -__v"
    );

    res.render("adminUserManagement", {
      user: req.user,
      options,
      users,
    });
  } catch (error) {
    next(error);
  }
}
async function categoriesManagement(req, res, next) {
  try {
    // cho sidebar
    const categories = await Category.find({}).select("-__v");
    const options = categories.map((category) => category.name);

    res.render("adminCategoriesManagement", {
      user: req.user,
      categories,
      options,
    });
  } catch (error) {
    next(error);
  }
}

exports.userManagement = userManagement;
exports.categoriesManagement = categoriesManagement;
