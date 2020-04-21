const Bank = require("../Models/Bank");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt=require('bcryptjs');
const date = require('date-and-time');

router.get('/', async (req,res)=>{

    const bankAccounts= await Bank.find();
    if(bankAccounts.length<1) return res.status(404).send("No stations Found");

    return res.status(200).send(bankAccounts);


});

router.post('/addBankAccount',async (req,res)=>{
    if(!req.body.name|| !req.body.PIN|| !req.body.password||! req.body.balance||!req.body.email) 
    return res.status(400).send("Bad Request");

    const bankAccount= await Bank.findOne({email:req.body.email});
    if(bankAccount) return res.status(400).send("Email already in use");
    const now = new Date();
    const month=now.getMonth();
    const year=now.getFullYear()%100+3;
    console.log("year: "+year);
    const validityDate = date.addYears(now, 3);

    const newBankAccount = new Bank({
        email:req.body.email,
        password:req.body.password,
        PIN:req.body.PIN,
        name:req.body.name,
        balance:parseFloat(req.body.balance),
        cardValidityDate:validityDate




    });
try {
        await newBankAccount.save();
    } catch (error) {
        console.log(error)
    }; 
    console.log(newBankAccount);
    return res.status(200).send(newBankAccount); 

});





module.exports = router;