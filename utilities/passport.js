const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const path = require("path");
const User = require(path.join(__dirname, "..", "models", "user"));

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      let user = await User.findOne({ username });
      if (!user) {
        user = await User.findOne({ mail: username });
        if (!user) {
          return done(null, false);
        }
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false);
      }

      done(null, {
        username: user.username,
        role: user.role,
        name: user.name,
        mail: user.mail,
        verified: user.verified,
      });
    } catch (error) {
      done(error);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      callbackURL: "account/googleAuth/callback",
    },
    function (accessToken, refreshToken, profile, callback) {
      return callback(null, {
        username: "GoogleUser_" + profile.emails[0].value.split("@")[0],
        name: profile.displayName,
        mail: profile.emails[0].value,
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, {
    username: user.username,
    role: user.role,
    name: user.name,
    mail: user.mail,
    verified: user.verified,
  });
});

passport.deserializeUser(async function (user, done) {
  try {
    let dbUser = await User.findOne({ username: user.username });
    if (!dbUser) {
      dbUser = await User.findOne({ mail: user.mail });
      if (!dbUser) {
        return done(null, false);
      }
    }

    done(null, {
      username: dbUser.username,
      role: dbUser.role,
      name: dbUser.name,
      mail: dbUser.mail,
      verified: dbUser.verified,
    });
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
