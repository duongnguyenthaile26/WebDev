const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const path = require("path");
const User = require(path.join(__dirname, "..", "models", "user"));

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false);
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false);
      }
      done(null, { username: user.username, role: user.role, name: user.name });
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, { username: user.username, name: user.name, role: user.role });
});

passport.deserializeUser(function (user, done) {
  done(null, { username: user.username, name: user.name, role: user.role });
});

passport.isAdmin = function (req, res, next) {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.redirect("/denied");
};

passport.isUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/denied");
};

module.exports = passport;
