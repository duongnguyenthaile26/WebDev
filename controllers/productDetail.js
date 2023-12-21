const path = require("path");
const Flag = require(path.join(__dirname, "..", "models", "flag"));
const url = require("url");
const Category = require(path.join(__dirname, "..", "models", "category"));

async function render(req, res, next) {
  try {
    const categories = await Category.find({}).select("-__v");
    const options = categories.map(category => category.name);

    const flagId = req.params.flagId; // Lấy id của flag từ URL
    const flag = await Flag.findById(flagId).lean();
    const type = flag.type;
    const flagsToShow = await Flag.find({ type }).lean();
    res.render("productDetail", {
      user: (req.user = true), // cái này xử lý sau
      flag,
      options,
      type,
      flagsToShow
    });
  } catch (error) {
    next(error);
  }
}

exports.render = render;
