const path = require("path");
const Flag = require(path.join(__dirname, "..", "models", "flag"));
const Category = require(path.join(__dirname, "..", "models", "category"));

async function render(req, res, next) {
  try {
    const categories = await Category.find({}).select("-__v");
    const options = categories.map((category) => category.name);
    const cheapestFlags = await Flag.find({})
      .sort({ price: 1 })
      .limit(12)
      .select("-__v");

    /*
      -Chỉnh code lại cho tổng quát hơn, bây giờ sẽ ko truyền từng object là từng danh mục cờ, mà sẽ truyền vào một mảng,
      mỗi phần tử trong mảng là một object, mỗi object sẽ có name (tên danh mục), và flags (các cờ của danh mục đó)
      -Cấu trúc của flagsByCategory:
      [
        {
          name: "National",
          flags: [{}, {}, {}, {}] // mỗi một object là một cờ
        },
        {
          name: "Political",
          flags: [{}, {}, {}, {}]
        }, ...
      ]
    */
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

    // Phần trên sẽ thay thế cho phần này, sau khi cài đặt xong phần trên sẽ xóa phần này
    // const nationalFlags = await Flag.aggregate([
    //   { $match: { type: "national" } },
    //   { $sample: { size: 4 } },
    //   { $project: { __v: 0 } },
    // ]);
    // // 4 cờ political ngẫu nhiên
    // const politicalFlags = await Flag.aggregate([
    //   { $match: { type: "political" } },
    //   { $sample: { size: 4 } },
    //   { $project: { __v: 0 } },
    // ]);
    // // 4 cờ organizational ngẫu nhiên
    // const orgFlags = await Flag.aggregate([
    //   { $match: { type: "organizational" } },
    //   { $sample: { size: 4 } },
    //   { $project: { __v: 0 } },
    // ]);
    // // 4 cờ type sporting ngẫu nhiên
    // const sportingFlags = await Flag.aggregate([
    //   { $match: { type: "sporting" } },
    //   { $sample: { size: 4 } },
    //   { $project: { __v: 0 } },
    // ]);
    // // 4 cờ type others ngẫu nhiên
    // const otherFlags = await Flag.aggregate([
    //   { $match: { type: "others" } },
    //   { $sample: { size: 4 } },
    //   { $project: { __v: 0 } },
    // ]);

    /*
    -Vê phần user, nếu !user (tức là người dùng chưa đăng nhập), thì lúc nhấn vào icon user thì sẽ dropdown là đăng nhập và đăng ký
    -ngược lại thì sẽ dropdown là "profile page" và "logout"
    */

    res.render("home", {
      user: (req.user = true), // cái này xử lý sau cũng được
      cheapestFlags,
      // nationalFlags,
      // politicalFlags,
      // orgFlags,
      // sportingFlags,
      // otherFlags,
      flagsByCategory,
      options,
    });
  } catch (error) {
    next(error);
  }
}

exports.render = render;
