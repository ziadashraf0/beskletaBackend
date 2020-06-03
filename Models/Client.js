const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
const autoIncrement = require('mongoose-auto-increment');
const Ride = require("../Models/Ride");
const PromoCode=require("../Models/PromoCode");
const ClientSchema = new mongoose.Schema({
  SSN: {
    type: String,
    required: true,
    unique: true,
    primaryKey: true
  },
  userName:{
    type:String,
    required:true,
    unique:true
  }
  ,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  phoneNumber: String,
  firstName: String,
  lastName: String,
  birthDate: Date,
  bankAccountNumber: {
    type: String
  },
  dependents: [ Number ],
  //rides: [],
  state: {
    type:String,
    enum:['Available','Not Available']},

  activated:Boolean,
  isDependent:Boolean,
  parentID:Number,
  Notifications:[],
  awaitingConfirmation:Boolean,
  promoCode:{type:PromoCode.schema,
    default:null
  }
});
ClientSchema.pre('save', function (next) {
  const user = this

  bcrypt.hash(user.password, 10, function (err, encrypted) {
    if (err) throw err;
    user.password = encrypted
    next()
  })
})
autoIncrement.initialize(mongoose);
ClientSchema.plugin(autoIncrement.plugin, 'Client');
module.exports = mongoose.model("Client", ClientSchema);
