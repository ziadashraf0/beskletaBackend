const mongoose = require("mongoose");



const NotificationSchema = new mongoose.Schema({
  type:{
      type:String,
      enum:['Dependent Request','Request Confirmed','Promo Code','Ride Request']
  },
  viewed:Boolean,
  message:String,
  dependentEmail:String
});


module.exports = mongoose.model("Notification", NotificationSchema);
