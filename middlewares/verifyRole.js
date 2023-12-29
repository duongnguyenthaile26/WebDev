function verifyAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.redirect("/denied");
}

function verifyUser(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/denied");
}

function verifyGuest(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/denied");
}

exports.verifyAdmin = verifyAdmin;
exports.verifyUser = verifyUser;
exports.verifyGuest = verifyGuest;
