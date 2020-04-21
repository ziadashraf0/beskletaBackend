const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const autoIncrement = require('mongoose-auto-increment');
const date = require('date-and-time');

const BankSchema = new mongoose.Schema({
   
    bankAccountNumber: {
        type: String,
        unique: true,
        required: true,
        primaryKey: true
    },
    cardVerificationCode:String,
    name: String,
    Balance: mongoose.Decimal128,
    cardValidityDate: Date,
    PIN: String,
    cardNumber: String,
    email: {
        type: String,
        unique: true,
        required:true
    },
    password: String,
    
});
BankSchema.pre('save', function (next) {
    const user = this

    bcrypt.hash(user.PIN, 10, function (err, encrypted) {
        if (err) throw err;
        user.PIN = encrypted
        next()
    })
})
autoIncrement.initialize(mongoose);
BankSchema.plugin(autoIncrement.plugin, { model: 'BankSchema', field: 'bankAccountNumber' });
BankSchema.plugin(autoIncrement.plugin, { model: 'BankSchema', field: 'cardVerificationCode' });
BankSchema.plugin(autoIncrement.plugin, { model: 'BankSchema', field: 'cardNumber' });

module.exports = mongoose.model('Bank', BankSchema);