const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
//import * as mongoose from 'mongoose';
//import {Schema} from 'mongoose';

//const bcrypt = require('bcrypt-nodejs');
const AdminSchema = new mongoose.Schema({

    SSN: {
        type: String,
      required: true,
       unique: true,
       primaryKey: true
    },
    email: {
        type: String,

       required: true,
       unique: true
    },
    password:{type:String,
        //bcrypt:true
    } ,
    phoneNumber: String,
    userName: {
        type: String,

        required: true,
        unique: true
    },
    
    birthDate: Date,
    reports:[]

});
AdminSchema.pre('save', function (next) {
    const user = this

    bcrypt.hash(user.password, 10, function (err, encrypted) {
        if (err) throw err;
        user.password = encrypted
        next()
    })
})



module.exports = mongoose.model('Admin', AdminSchema);