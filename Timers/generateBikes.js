const mongoose = require("mongoose");
var BodyParser = require("body-parser");
var cors = require("cors");
const express = require("express");
const router = express.Router();
const Bike = require("../Models/Bike");
const Station = require("../Models/Station");
const Client = require("../Models/Client");
const Ride = require("../Models/Ride");
const Notification = require("../Models/Notification");
const Owner = require("../Models/Owner");
const timeoutObj = setTimeout(() => {
  addBikes();
}, 1500);
module.exports = router;
async function addBikes() {
  const stations = await Station.find();
  const owner = await Owner.findOne();
  for (let index = 0; index < stations.length; index++) {
    for (let i = 0; i < 15; i++) {
      let bike = new Bike({
        ownerSSN: owner.SSN,
        state: "Available",
        category: "type A",
        colour: "Blue",
        size: "26",
        condition: "Good",
        rate: "12",
        stationName: stations[index].stationName,
      });
      //console.log(owner.SSN);
      try {
        await bike.save();
      } catch (error) {
        console.log("error");
      }
    }
  }
}