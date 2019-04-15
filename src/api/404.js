const path = require("path");
const express = require("express");

const app = express();

app.use((req, res, next) => {
  const notFoundPage = path.resolve(__dirname, "../../dist/404/index.html");
  res.status(404).sendFile(notFoundPage);
});

module.exports = app;
