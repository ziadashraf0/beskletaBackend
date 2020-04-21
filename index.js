const express = require("express");
const app = express();
require("./startup/routes")(app);
require("./startup/db")();

const Joi = require("joi");
const portNumber = 4000;
const config = require("config");

//Connecting to Beskleta DataBase ;

app.listen(portNumber, () =>
  console.log(`listening to port #${portNumber || process.env.PORT}`)
);
