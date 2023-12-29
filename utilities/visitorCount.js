const path = require("path");
const VisitorCount = require(path.join(
  __dirname,
  "..",
  "models",
  "visitorCount.js"
));

async function incrementVisitorCount(req, res, next) {
  try {
    const today = new Date().toISOString().split("T")[0];
    await VisitorCount.findOneAndUpdate(
      { date: today },
      { $inc: { count: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    next(error);
  }
}
