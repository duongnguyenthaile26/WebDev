const path = require("path");
const VisitorCount = require(path.join(
  __dirname,
  "..",
  "models",
  "visitorCount.js"
));

async function countVisitor(req, res, next) {
  try {
    if (!req.session.visited) {
      const today = new Date().toISOString().split("T")[0];
      await VisitorCount.findOneAndUpdate(
        { date: today },
        { $inc: { count: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      req.session.visited = true;
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = countVisitor;
