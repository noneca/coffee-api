const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const indexRoutes = require("./routes/index");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const shopRoutes = require("./routes/shops");

mongoose.connect("mongodb://localhost:27017/mynewDB", function (err, db) {
  if (!err) {
    console.log("We are connected");
  }
});

app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("./public"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Routes which should handle requests

app.use("/", indexRoutes);
app.use("/products", productRoutes);
app.use("/user", userRoutes);
app.use("/shop", shopRoutes);

//If U reach here..
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
