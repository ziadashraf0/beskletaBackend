const Admin = require("../Routes/admin");
const Owner = require("../Routes/owner");
const Bike = require("../Routes/bike");
const Client = require("../Routes/client");
const Station = require("../Routes/station");
const Bank = require("../Routes/bank");
var BodyParser = require("body-parser");
var cors = require("cors");
const express = require("express");

module.exports = function(app) {
  app.use(cors());
  app.use(express.json());
  app.use(BodyParser.json());
  app.use(BodyParser.urlencoded({ extended: true }));
  app.use("/bike", Bike);
  app.use("/owner", Owner);
  app.use("/admin", Admin);
  app.use("/client", Client);
  app.use("/station", Station);
  app.use("/bank", Bank);
};
