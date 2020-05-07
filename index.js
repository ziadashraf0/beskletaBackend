const express = require("express");
const app = express();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/timers");
const Joi = require("joi");
const portNumber = 4000;
const config = require("config");

//Connecting to Beskleta DataBase ;
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`listening to port #${port}`));

  
