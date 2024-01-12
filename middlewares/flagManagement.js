const path = require("path");
const fs = require("fs");
const Flag = require(path.join(__dirname, "..", "models", "flag"));
const Category = require(path.join(__dirname, "..", "models", "category"));

async function unlinkFile(fileName) {
  try {
    const filePath = path.join(__dirname, "..", "public", "flags", fileName);
    await fs.promises.access(filePath, fs.constants.F_OK);
    await fs.promises.unlink(filePath);
  } catch (error) {
    return;
  }
}

async function verifyFlagInfo(req, res, next) {
  try {
    req.body.name = req.body.name.trim();
    console.log(req.fileName);
    const { name, price, type } = req.body;
    if (name.length < 4) {
      await unlinkFile(req.fileName);
      return res.json({
        status: "fail",
        message: "Flag name must be at least 4 characters long",
      });
    }
    if (price <= 0) {
      await unlinkFile(req.fileName);
      return res.json({
        status: "fail",
        message: "Price must be a positive number",
      });
    }
    const flag = await Flag.findOne({ name: name });
    if (flag) {
      if (!req.params.flagId) {
        await unlinkFile(req.fileName);
        return res.json({
          status: "fail",
          message: "Flag name already taken",
        });
      } else {
        const { flagId } = req.params;
        const flagByID = await Flag.findById(flagId);
        if (flagByID.name !== name) {
          await unlinkFile(req.fileName);
          return res.json({
            status: "fail",
            message: "Flag name already taken",
          });
        }
      }
    }
    const category = await Category.findOne({ name: type });
    if (!category) {
      await unlinkFile(req.fileName);
      return res.json({
        status: "fail",
        message: "Flag category does not exist",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
}

exports.verifyFlagInfo = verifyFlagInfo;
