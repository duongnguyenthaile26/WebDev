const path = require("path");
const Flag = require(path.join(__dirname, "..", "models", "flag"));
const Category = require(path.join(__dirname, "..", "models", "category"));
const User = require(path.join(__dirname, "..", "models", "user"));

async function render(req, res, next) {
  try {
    // cho sidebar
    const categories = await Category.find({}).select("-__v");
    const options = categories.map((category) => category.name);
    const users = await User.find({}).select("-password");

    res.render("admin_userMangement", {
      user: "admin", // cái này để đi đến trang người dùng (khi nào có thì cài đặt sau)
      options, // cho sidebar
      users,
    });
  } catch (error) {
    next(error);
  }
}

exports.render = render;
