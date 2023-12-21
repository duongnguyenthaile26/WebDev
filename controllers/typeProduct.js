const path = require("path");
const Flag = require(path.join(__dirname, "..", "models", "flag"));
const Category = require(path.join(__dirname, "..", "models", "category"));
const url = require("url");

async function render(req, res, next) {
  try {
    const categories = await Category.find({}).select("-__v");
    const options = categories.map(category => category.name);

    
    const query = url.parse(req.url, true).query;
    const type = query.type;
    const page = parseInt(query.page) || 1; // Trang hiện tại, mặc định là 1
    const itemsPerPage = 8; // Số lượng sản phẩm trên mỗi trang

    const flags = await Flag.aggregate([
      { $match: { type: type } },
      { $project: { __v: 0 } },
    ]);
    const totalPages = Math.ceil(flags.length / itemsPerPage); // Tính tổng số trang
    // Lấy phần của danh sách sản phẩm tương ứng với trang hiện tại
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const flagsOnPage = flags.slice(startIndex, endIndex);

    res.render("typeProduct", {
      user: (req.user = true), // cái này xử lý sau
      type: type.toUpperCase(),
      flags: flagsOnPage, // Chỉ truyền danh sách sản phẩm trên trang hiện tại
      currentPage: page,
      itemsPerPage: itemsPerPage,
      totalPages: totalPages,
      currentPageUrl: req.originalUrl.split("?")[0], // URL của trang hiện tại,
      options,
    });
  } catch (error) {
    next(error);
  }
}

exports.render = render;
