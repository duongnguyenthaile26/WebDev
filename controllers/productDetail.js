const path = require("path");
const Flag = require(path.join(__dirname, "..", "models", "flag"));
const url = require("url");
const Category = require(path.join(__dirname, "..", "models", "category"));

async function render(req, res, next) {
  try {
    const categories = Category.find({}).select("-__v");
    const options = [];
    for (let i = 0; i < categories.length; i++) {
      options.push(categories[i].name);
    }

    const flagId = req.params.flagId; // Lấy id của flag từ URL
    const flag = await Flag.findById(flagId).lean();
    
    res.render("productDetail", {
      user: (req.user = true), // cái này xử lý sau
      flag,
      options
    });
  } catch (error) {
    next(error);
  }
}

exports.render = render;
