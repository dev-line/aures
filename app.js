const express = require("express"),
  app = express(),
  Config = require("./ConfigServer"),
  Admin = require("./controller/Admin"),
  Visitor = require('./controller/Visitor');

Config(express, app);
Admin(app);
Visitor(app);

app.get('*', (req, res) => {
  res.render('error')
});