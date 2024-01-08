const path = require("path");
const Flag = require(path.join(__dirname, "..", "models", "flag"));
const url = require("url");
const Category = require(path.join(__dirname, "..", "models", "category"));
const User = require(path.join(__dirname, "..", "models", "user"));

async function detail(req, res, next) {
  try {
    const categories = await Category.find({}).select("-__v");
    const options = categories.map((category) => category.name);

    const flagId = req.params.flagId; // Lấy id của flag từ URL
    const flag = await Flag.findById(flagId).lean();
    const type = flag.type;
    const flagsToShow = await Flag.find({ type }).lean();
    res.render("productDetail", {
      user: req.user,
      flag,
      options,
      type,
      flagsToShow,
    });
  } catch (error) {
    next(error);
  }
}

async function search(req, res, next) {
  try {
    const categories = await Category.find({}).select("-__v");
    const options = categories.map((category) => category.name);

    let allFlags = await Flag.aggregate([{ $project: { __v: 0 } }]);
    const query = req.query;
    const page = parseInt(query.page) || 1;
    const itemsPerPage = 9;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    let flags = [...allFlags]; // Tạo bản sao của allFlags để tránh thay đổi dữ liệu gốc
    const searchName = query.name ? query.name.toLowerCase() : null; // Chuyển tên tìm kiếm về chữ thường
    const selectedCategories = query.categories
      ? query.categories.split(",")
      : []; // Tách các giá trị categories từ query string

    if (searchName) {
      flags = flags.filter((flag) =>
        flag.name.toLowerCase().includes(searchName)
      );
    }

    if (selectedCategories.length > 0) {
      flags = flags.filter((flag) =>
        selectedCategories.some(
          (category) => flag.type.toLowerCase() === category
        )
      ); // Lọc theo các loại được chọn
    }

    const flagsOnPage = flags.slice(startIndex, endIndex);
    const totalPages = Math.ceil(flags.length / itemsPerPage);

    res.render("searchProduct", {
      user: req.user, // Sửa lại phần xử lý user
      checkboxes: query.categories ? query.categories.split(",") : [],
      options,
      flags: flagsOnPage,
      currentPage: page,
      itemsPerPage,
      totalPages,
      currentPageUrl: req.originalUrl.split("?")[0],
      searchName,
    });
  } catch (error) {
    next(error);
  }
}

async function type(req, res, next) {
  try {
    const categories = await Category.find({}).select("-__v");
    const options = categories.map((category) => category.name);

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
      user: req.user, // cái này xử lý sau
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

async function addToCart(req, res, next) {
  try {
    const username = req.user.username;
    const { flagID, quantity: quantityString } = req.body;
    const quantity = Number(quantityString);

    const user = await User.findOne({ username });

    const itemIndex = user.cart.findIndex((item) => item.flagID === flagID);

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += quantity;
    } else {
      user.cart.push({ flagID, quantity: quantity });
    }

    user.markModified("cart");
    await user.save();

    res.json({ status: "success" });
  } catch (error) {
    next(error);
  }
}

exports.detail = detail;
exports.search = search;
exports.type = type;
exports.addToCart = addToCart;
