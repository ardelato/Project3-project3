const passport = require("passport");
const LocalStrategy = require("./passport-config");

const User = require("../../models/users");

// User has been authenticated and can use functionality
passport.serializeUser((user, done) => {
  done(null, { _id: user._id, firstName: user.firstName });
});

// Deauthenticate the user
passport.deserializeUser((id, done) => {
  User.findOne({ _id: id }, "email", (err, user) => {
    done(null, user);
  });
});

passport.use(LocalStrategy);

module.exports = passport;
