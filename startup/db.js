const mongoose = require("mongoose");
const config = require("config");
module.exports = function() {
  mongoose
    .connect(config.get("db"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify:false
    })
    .then(
      () => {
        /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */
        console.log("DATABASE Created !");
      },
      err => {
        /** handle initial connection error */
        console.error(err);
      }
    );
};
