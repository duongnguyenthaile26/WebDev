const path = require("path");
const Flag = require(path.join(__dirname, "..", "models", "flag"));
const Category = require(path.join(__dirname, "..", "models", "category"));

async function render(req, res, next) {
  try {
    // cho sidebar
    const categories = await Category.find({}).select("-__v");
    const options = categories.map((category) => category.name);

    // nếu người dùng là admin
    if (req.user && req.user.role === "admin") {
      return res.render("profile", {
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

    // nếu người dùng không phải admin (guest hoặc user)
    res.render("profile", {
      user: req.user,
      cheapestFlags,
      flagsByCategory,
      options,
    });
  } catch (error) {
    next(error);
  }
}

exports.render = render;