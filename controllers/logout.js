const path = require("path");

function logout(req, res) {
  req.logout(function (error) {
    if (error) {
      return res.json({ err, referer: req.get("Referer") });
    }
    req.session.visited = req.tempVisited;
    res.json({
      status: "success",
      message: "Logout successfully",
      referer: req.get("Referer"),
    });
  });
}

exports.logout = logout;
