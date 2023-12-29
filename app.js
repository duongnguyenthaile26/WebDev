// Requires
const path = require("path");
const express = require("express");
require("dotenv").config();

const passport = require(path.join(__dirname, "utilities", "passport"));
const AppError = require(path.join(__dirname, "utilities", "AppError"));

const globalErrorHandler = require(path.join(
  __dirname,
  "controllers",
  "error"
));

const homeRouter = require(path.join(__dirname, "routes", "home"));
const loginRouter = require(path.join(__dirname, "routes", "login"));
const logoutRouter = require(path.join(__dirname, "routes", "logout"));
const registerRouter = require(path.join(__dirname, "routes", "register"));
const typeRouter = require(path.join(__dirname, "routes", "typeProduct"));
const productRouter = require(path.join(__dirname, "routes", "productDetail"));
const searchRouter = require(path.join(__dirname, "routes", "searchProduct"));
const googleAuthRouter = require(path.join(__dirname, "routes", "googleAuth"));

// Initializes
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  require("express-session")({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// setters
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/denied", function (req, res) {
  res.render("denied");
});

app.use("/", homeRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/register", registerRouter);
app.use("/typeProduct", typeRouter);
app.use("/productDetail", productRouter);
app.use("/searchProduct", searchRouter);
app.use("/googleAuth", googleAuthRouter);

app.all("*", function (req, res, next) {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
