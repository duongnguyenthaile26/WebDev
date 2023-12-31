const path = require("path");
const Flag = require(path.join(__dirname, "..", "models", "flag"));
const Category = require(path.join(__dirname, "..", "models", "category"));

async function render(req, res, next) {
  try {
    // cho sidebar
    const categories = await Category.find({}).select("-__v");
    const options = categories.map((category) => category.name);
    const flags = await Flag.find.select("-__v");

    res.render("admin_categoryManagement", {
      user: "admin", // cái này để đi đến trang người dùng (khi nào có thì cài đặt sau)
      options, // cho sidebar
      flags,
    });
  } catch (error) {
    next(error);
  }
}

exports.render = render;
