const path = require("path");
const passport = require(path.join(__dirname, "..", "utilities", "passport"));

function login(req, res, next) {
  passport.authenticate("local", function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({ message: "login failed", status: "fail" });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      res.json({
        message: "login successful",
        status: "success",
        referer: req.get("Referer"),
      });
    });
  })(req, res, next);
}

exports.login = login;
