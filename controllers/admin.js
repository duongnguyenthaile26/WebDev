const path = require("path");
const Flag = require(path.join(__dirname, "..", "models", "flag"));
const Category = require(path.join(__dirname, "..", "models", "category"));
const User = require(path.join(__dirname, "..", "models", "user"));
const fs = require("fs");

async function userManagement(req, res, next) {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select(
      "-password -__v"
    );
    res.render("adminUserManagement", {
      user: req.user,
      users,
    });
  } catch (error) {
    next(error);
  }
}

async function categoryManagement(req, res, next) {
  try {
    const categories = await Category.find({}).select("-__v");
    res.render("adminCategoriesManagement", {
      user: req.user,
      categories,
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

async function changeName(req, res, next) {
  try {
    const { categoryName, newCategoryName } = req.body;
    const checkNewCategoryName = await Category.findOne({
      name: newCategoryName,
    });
    if (checkNewCategoryName) {
      return res.json({
        status: "fail",
        message: "New category name has already been taken",
      });
    }
    const category = await Category.findOne({ name: categoryName });
    category.name = newCategoryName;
    category.markModified("name");
    await category.save();
    const flags = await Flag.find({ type: categoryName });
    for (let i = 0; i < flags.length; i++) {
      flags[i].type = newCategoryName;
      flags[i].markModified("type");
      await flags[i].save();
    }
    res.json({
      status: "success",
      message: "Successfully changed category name",
    });
  } catch (error) {
    next(error);
  }
}

async function removeCategory(req, res, next) {
  try {
    const { categoryName } = req.body;
    await Category.findOneAndDelete({ name: categoryName.toLowerCase() });
    const flags = await Flag.find({ type: categoryName.toLowerCase() });
    for (let i = 0; i < flags.length; i++) {
      const imagePath = path.join(
        __dirname,
        "..",
        "public",
        "flags",
        flags[i].image
      );
      fs.unlink(imagePath, async function (error) {
        if (error) {
          console.error(error);
        } else {
          await Flag.deleteOne({ _id: flags[i]._id });
        }
      });
    }
    res.send({
      status: "success",
      message: "Remove category successfully",
    });
  } catch (error) {
    next(error);
  }
}

exports.userManagement = userManagement;
exports.categoryManagement = categoryManagement;
exports.removeUser = removeUser;
exports.changeName = changeName;
exports.removeCategory = removeCategory;
