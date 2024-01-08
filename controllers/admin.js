const path = require("path");
const Flag = require(path.join(__dirname, "..", "models", "flag"));
const Category = require(path.join(__dirname, "..", "models", "category"));
const User = require(path.join(__dirname, "..", "models", "user"));

async function userManagement(req, res, next) {
  try {
    const categories = await Category.find({}).select("-__v");
    const options = categories.map((category) => category.name);

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
async function categoryManagement(req, res, next) {
  try {
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

async function removeUser(req, res, next) {
  try {
    await User.findOneAndDelete({ username: req.body.username });
    res.json({
      status: "success",
      message: "Delete user successfully",
    });
  } catch (error) {
    next(error);
  }
}

exports.userManagement = userManagement;
exports.categoryManagement = categoryManagement;
exports.removeUser = removeUser;
