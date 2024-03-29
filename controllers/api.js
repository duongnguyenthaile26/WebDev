const path = require("path");
const VisitorCount = require(path.join(
  __dirname,
  "..",
  "models",
  "visitorCount"
));

async function visitorData(req, res, next) {
  try {
    const data = await VisitorCount.find()
      .sort({ date: -1 })
      .limit(7)
      .select("-_id -__v");
    res.json({ status: "success", data });
  } catch (error) {
    next(error);
  }
}

exports.visitorData = visitorData;
