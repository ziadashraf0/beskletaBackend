const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
var bcrypt = require('bcryptjs');

const OwnerSchema = new mongoose.Schema({

    SSN: {
        type: String,
        required: true,
        unique: true,
        primaryKey: true
    },
    userName:{
        type: String,
        required: true,
        unique: true
    }
    ,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{type:String,
        //bcrypt:true
    } ,
    phoneNumber: String,
    firstName: String,
    lastName: String,
    birthDate: Date,
    bankAccountNumber: String,
    Notifications:[]
});
OwnerSchema.pre('save', function (next) {
    const user = this

    bcrypt.hash(user.password, 10, function (err, encrypted) {
        if (err) throw err;
        user.password = encrypted
        next()
    })
})
module.exports = mongoose.model('Owner', OwnerSchema);