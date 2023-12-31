// Requires
const path = require("path");
const express = require("express");
require("dotenv").config();

const passport = require(path.join(__dirname, "utilities", "passport"));
const AppError = require(path.join(__dirname, "utilities", "AppError"));

const countVisitor = require(path.join(
  __dirname,
  "middlewares",
  "countVisitor"
));
const globalErrorHandler = require(path.join(
  __dirname,
  "controllers",
  "error"
));
const verifyRole = require(path.join(__dirname, "middlewares", "verifyRole"));

const homeRouter = require(path.join(__dirname, "routes", "home"));
const accountRouter = require(path.join(__dirname, "routes", "account"));
const productRouter = require(path.join(__dirname, "routes", "product"));
const apiRouter = require(path.join(__dirname, "routes", "api"));
const checkoutRouter = require(path.join(__dirname, "routes", "checkout"));
const adminRouter = require(path.join(__dirname, "routes", "admin"));

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
app.use(function (req, res, next) {
  if (req.url === "/favicon.ico") {
    return res.status(204).end();
  }
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(countVisitor);

// setters
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/denied", function (req, res) {
  res.render("denied");
});
app.use("/", homeRouter);
app.use("/account", accountRouter);
app.use("/product", productRouter);
app.use("/api", apiRouter);
app.use("/checkout", verifyRole.verifyUser, checkoutRouter);
app.use("/admin", verifyRole.verifyAdmin, adminRouter);

app.all("*", function (req, res, next) {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
