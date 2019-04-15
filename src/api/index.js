const path = require("path");
const fse = require("fs-extra");

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;


// Configure the local strategy for use by Passport.
//
// The local strategy requires a `verify` function which receives the
// credentials (`username` and `password`) submitted by the user.  The function
// must verify that the password is correct and then invoke `cb` with a user
// object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(
  new LocalStrategy(
    async function verify(username, password, cb) {
      console.log(`passport verify()`, {username, password});
      // NOTE: fake authentication here, replace with your own auth logic
      const user = {
        username,
      };
      
      if (user) {
        // successful login
        return cb(null, user);
      } else {
        // failed login
        return cb(null, false);
      }
    }
  )
);


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));

// Create a new Express application.
const app = express();
app.enable("trust proxy");

app.use(morgan("tiny"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: "CHANGE ME!",
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Marking URLs that require login
const loginRequired = (req, res, next) => {
  if (!req.user) {
    res.redirect(`/login?returnTo=${encodeURIComponent(req.url)}`)
  } else {
    next();
  }
};
app.get("/foo", loginRequired);
app.get("/bar", loginRequired);
app.get("/baz", loginRequired);
app.get("/profile", loginRequired);

app.get("/login", (req, res, next) => {
  console.dir(req.session);
  next();
});

app.post("/login", (req, res, next) => {
  console.log(`POST /login`);
  passport.authenticate("local", (err, user, info) => {
    console.log(`passport.authenticate`, {err, user, info});
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(403).json({
        error: info.message,
      });
    }
    
    req.login(user, (err) => {
      if (err) {
        return next(err);
      } else {
        return res.json({
          user: user,
          returnTo: req.session.returnTo,
        });
      }
    });
  })(req, res, next);
});

app.get("/whoami", loginRequired, (req, res) => {
  res.json({
    user: req.user,
  });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports.apiServer = app;

if (require.main === module) {
  // FIXME: static serving for dist folder
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });
}
