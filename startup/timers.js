var BodyParser = require("body-parser");
var cors = require("cors");
const express = require("express");
const ridesTimer =require("../Timers/ridesTimer");
const profitDistribution =require("../Timers/profitDistribution");
const generateBikes =require("../Timers/generateBikes");


const router = express.Router();

module.exports =router;