const path = require("path");
const Flag = require(path.join(__dirname, "..", "models", "flag"));
const Category = require(path.join(__dirname, "..", "models", "category"));

async function render(req, res, next) {
  try {
    const categories = await Category.find({}).select("-__v");
    const options = categories.map((category) => category.name);

    if (req.user && req.user.role === "admin") {
      return res.render("home", {
        user: req.user,
        options,
      });
    }

    const cheapestFlags = await Flag.find({})
      .sort({ price: 1 })
      .limit(12)
      .select("-__v");

    const flagsByCategory = [];
    for (let i = 0; i < options.length; i++) {
      const category = { name: options[i] };
      const flags = await Flag.aggregate([
        { $match: { type: category.name.toLowerCase() } },
        { $sample: { size: 4 } },
        { $project: { __v: 0 } },
      ]);
      category.flags = flags;
      flagsByCategory.push(category);
    }

    res.render("home", {
      user: req.user,
      cheapestFlags,
      flagsByCategory,
      options,
    });
  } catch (error) {
    next(error);
  }
}

async function about(req, res, next) {
  try {
    const categories = await Category.find({}).select("-__v");
    const options = categories.map((category) => category.name);
    res.render("about", {
      user: req.user,
      options,
    });
  } catch (error) {
    next(error);
  }
}

exports.render = render;
exports.about = about;
