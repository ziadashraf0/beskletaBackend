const mongoose = require("mongoose");



const NotificationSchema = new mongoose.Schema({
  type:{
      type:String,
      enum:['Dependent Request','Request Confirmed','PromoCode','Ride Request','TimeOut','Ride Terminated','Profit','Activation Request Rejection','Report','Ride Cancelled']
  },
  viewed:Boolean,
  message:String,
  dependentEmail:String
});


module.exports = mongoose.model("Notification", NotificationSchema);
