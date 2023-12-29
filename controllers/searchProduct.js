const path = require("path");
const Flag = require(path.join(__dirname, "..", "models", "flag"));
const url = require("url");
const Category = require(path.join(__dirname, "..", "models", "category"));

async function render(req, res, next) {
  try {
    const categories = await Category.find({}).select("-__v");
    const options = categories.map(category => category.name);

    let allFlags = await Flag.aggregate([{ $project: { __v: 0 } }]);
    const query = req.query;
    const page = parseInt(query.page) || 1;
    const itemsPerPage = 8;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    let flags = [...allFlags]; // Tạo bản sao của allFlags để tránh thay đổi dữ liệu gốc
    const searchName = query.name ? query.name.toLowerCase() : null; // Chuyển tên tìm kiếm về chữ thường
    const selectedCategories = query.categories ? query.categories.split(',') : []; // Tách các giá trị categories từ query string

    if (searchName) {
      flags = flags.filter(flag => flag.name.toLowerCase().includes(searchName));
    }

    if (selectedCategories.length > 0) {
      flags = flags.filter(flag => selectedCategories.some(category => flag.type.toLowerCase() === category)); // Lọc theo các loại được chọn
    }

    const flagsOnPage = flags.slice(startIndex, endIndex);
    const totalPages = Math.ceil(flags.length / itemsPerPage);

    res.render("searchProduct", {
      user: req.user, // Sửa lại phần xử lý user
      options,
      flags: flagsOnPage,
      currentPage: page,
      itemsPerPage,
      totalPages,
      currentPageUrl: req.originalUrl.split("?")[0],
      searchName
    });
  } catch (error) {
    next(error);
  }
}


exports.render = render;
