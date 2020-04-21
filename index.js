const mongoose = require("mongoose");
const express = require("express");
const app = express();
const Joi = require("joi");
const portNumber = 4000;
const Admin = require("./Routes/admin");
const Owner = require("./Routes/owner");
const Bike = require("./Routes/bike");
const Client = require("./Routes/client");
const Station = require("./Routes/station");
const Bank = require("./Routes/bank");

var BodyParser = require("body-parser");
var cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

//Connecting to Beskleta DataBase ;
mongoose.connect(
  "mongodb://ziad:zozforzoz1@ds361085.mlab.com:61085/heroku_x8h0zwnq",
  { useNewUrlParser: true },
  function(err) {
    {
      if (err) {
        console.log("Some problem with the connection " + err);
      } else {
        console.log("The Mongoose connection is ready");
      }
    }
  }
);
// mongoose
//   .connect(url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
//   })
//   .then(
//     () => {
//       /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */
//       console.log("DATABASE Created !");
//     },
//     err => {
//       /** handle initial connection error */
//       console.error(err);
//     }
//   );
app.use("/bike", Bike);
app.use("/owner", Owner);
app.use("/admin", Admin);
app.use("/client", Client);
app.use("/station", Station);
app.use("/bank", Bank);

app.listen(portNumber, () => console.log(`listening to port #${portNumber}`));
