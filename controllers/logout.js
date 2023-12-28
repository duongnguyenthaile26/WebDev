const path = require("path");

function logout(req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      return res.json({ err });
    }
    res.json({ message: "Logout successfully", referer: req.get("Referer") });
  });
}

exports.logout = logout;
