const mongoose = require("mongoose");



const PromoCodeSchema = new mongoose.Schema({
    description:String,
    code:{
        type:String,
        unique: true,
        primaryKey: true
    },
    numberOfRidesAvailable:Number,
    discountPercentage:Number,
    validityDate:Date
    
});


module.exports = mongoose.model("PromoCode", PromoCodeSchema);
