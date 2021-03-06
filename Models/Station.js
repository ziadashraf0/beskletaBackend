const mongoose = require('mongoose');
const StationSchema = new mongoose.Schema({

    name: {
        type: String,
        primaryKey: true,
        required: true,
        unique: true
    },
    longitude:{
     type:   mongoose.Decimal128,
     required:true
    },
    latitude:{
        type:   mongoose.Decimal128,
        required:true
       },
    maxCapacity: Number,
    numberBikes :Number,
    numberRides:Number,
    maxAllowedCapacity:Number    // Should be more than the maxCapacit by 5 slots.

});
module.exports = mongoose.model('Station', StationSchema);