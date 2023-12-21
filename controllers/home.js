const path = require("path");
const Flag = require(path.join(__dirname, "..", "models", "flag"));
const Category = require(path.join(__dirname, "..", "models", "category"));

async function render(req, res, next) {
  try {
    /*
    -Trong mục gợi ý sản phẩm, nhét 12 cờ rẻ nhất vào
    -cheapestFlags là một mảng gồm 12 phần tử, mỗi phần tử là một object gồm _id, name, price, image, type
    -ví dụ về một object trong mảng:
    {
      _id: new ObjectId('658131855b3f5194ddd346eb'),
      name: 'Norway',
      price: 106.01,
      image: 'no.png',
      type: 'national'
    }
    -hiển thị trên mỗi card là name, type, price, và image
    -image của flag sẽ có đường dẫn như sau: "flags/<%= flag.type %>/<%= flag.image %>"
    -trên mỗi tag card thì cho bọc bởi một tag a (tạm thời để href="#") và cho thêm cái id của tag <a> là id="<%= flag._id %>", để sau này có thể click vào và đi đến trang thông tin cờ
  */
    const categories = await Category.find({}).select("-__v");
    const options = categories.map(category => category.name);
    const cheapestFlags = await Flag.find({})
      .sort({ price: 1 })
      .limit(12)
      .select("-__v");
    /*
    4 cờ type national ngẫu nhiên (cấu trúc của mảng nationalFlags cũng như trên, là mảng 4 phần tử, mỗi phần tử là object)
    làm hệt như trên
  */
    const nationalFlags = await Flag.aggregate([
      { $match: { type: "national" } },
      { $sample: { size: 4 } },
      { $project: { __v: 0 } },
    ]);
    // 4 cờ political ngẫu nhiên
    const politicalFlags = await Flag.aggregate([
      { $match: { type: "political" } },
      { $sample: { size: 4 } },
      { $project: { __v: 0 } },
    ]);
    // 4 cờ organizational ngẫu nhiên
    const orgFlags = await Flag.aggregate([
      { $match: { type: "organizational" } },
      { $sample: { size: 4 } },
      { $project: { __v: 0 } },
    ]);
    // 4 cờ type sporting ngẫu nhiên
    const sportingFlags = await Flag.aggregate([
      { $match: { type: "sporting" } },
      { $sample: { size: 4 } },
      { $project: { __v: 0 } },
    ]);
    // 4 cờ type others ngẫu nhiên
    const otherFlags = await Flag.aggregate([
      { $match: { type: "others" } },
      { $sample: { size: 4 } },
      { $project: { __v: 0 } },
    ]);
    /*
    Vê phần user, nếu !user (tức là người dùng chưa đăng nhập), thì lúc nhấn vào icon user thì sẽ dropdown là đăng nhập và đăng ký
    ngược lại thì sẽ dropdown là "profile page" và "logout"
  */
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    res.render("home", {
      user: (req.user = true), // cái này xử lý sau cũng được
      cheapestFlags,
      nationalFlags,
      politicalFlags,
      orgFlags,
      sportingFlags,
      otherFlags,
      options,
    });
  } catch (error) {
    next(error);
  }
}

exports.render = render;
