const Bank = require("../Models/Bank");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt=require('bcryptjs');
const date = require('date-and-time');


router.post('/addBankAccount',async (req,res)=>{
    
    if(!req.body.name|| !req.body.PIN|| !req.body.password||!req.body.email) 
    return res.status(400).send("Bad Request");

    const bankAccount= await Bank.findOne({email:req.body.email});
    if(bankAccount) return res.status(400).send("Email already in use");
    const now = new Date();
    const validityDate = date.addYears(now, 3);

    const newBankAccount = new Bank({
        email:req.body.email,
        password:req.body.password,
        PIN:req.body.PIN,
        name:req.body.name,
        balance:100,
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
router.post('/login', async (req, res) => {
    if(!req.body.password||!req.body.email) 
    return res.status(400).send("Bad Request");

    //console.log(req.body);
    result = await Bank.find({ email: req.body.email});

    //if not found 
    if (result.length === 0) {
       // console.log('not found');
        return res.status(404).send('user is not found');
    }
    const hash=result[0].password;
    const results= await bcrypt.compare(req.body.password,hash);
        if(results=== true){
              console.log('AUTHORIZED');
        return res.status(200).send('AUTHORIZED');
        }else{
           // console.log('Not found');
        return res.status(404).send('Wrong Password');
        }
});

///Edit User Email
router.put('/edit/email', async (req, res) => {

    if(!req.body.newEmail||!req.body.email) 
    return res.status(400).send("Bad Request");

    const bank = await Bank.findOne({ email: req.body.email });
    // if user is not found in DataBase
    
    if (!bank) return res.status(404).send('Not found');

    if (req.body.newEmail) {

        let results = await Bank.find({ email: req.body.newEmail });
        if (results.length>0) {

   
            return res.status(400).send('Email already taken');
        }
        console.log(results);
        await Bank.updateOne({ _id: bank._id }, { $set: { email: req.body.newEmail } }); 
    } 
    const newbank = await Bank.findOne({ email: req.body.newEmail });
    console.log(newbank);
    res.status(200).send(newbank);


});
router.put('/edit/password', async (req, res) => {
    if(!req.body.password||!req.body.email||!req.body.newPassword) 
    return res.status(400).send("Bad Request");

    const bank = await Bank.findOne({ email: req.body.email });
    // if user is not found in DataBase
    if (!bank) return res.status(404).send('wrong Email');
    const hash=bank.password;
    const results= await bcrypt.compare(req.body.password,hash);
    if(!results)
    {
        return res.status(404).send('Wrong Password');
    }
    //check if oldPassword=== newPassword
    const check= await bcrypt.compare(req.body.newPassword,hash);
    if(check === true){
        return res.status(400).send('same old password');
    }
    if(req.body.newPassword){
        //hashing the new password
        bcrypt.hash(req.body.newPassword, 10).then(async (hash)=>{
        //updating the password
         await Bank.updateOne({ _id: bank._id }, { $set: { password: hash } });
        });        
    }
    const newUser = await Bank.findOne({ email: req.body.email });
    console.log(newUser);
    res.status(200).send(newUser);


});
router.put('/deposit', async (req, res) => {
    console.log(req.body)
    if(!req.body.deposit||!req.body.email) 
    return res.status(400).send("Bad Request");
    const bank = await Bank.findOne({ email: req.body.email });
    // if user is not found in DataBase
    if (!bank) {
        return res.status(404).send('Not found');
    }
    if (req.body.deposit) {
        await Bank.updateOne({ _id: bank._id }, { $inc: { balance: req.body.deposit } } 
            );
    }
    const newbank = await Bank.findOne({ email: req.body.email });
    res.status(200).send(newbank);

});
router.put('/withdraw', async (req, res) => {
    if(!req.body.withdraw||!req.body.email) 
    return res.status(400).send("Bad Request");
    console.log(req.body);
    const bank = await Bank.findOne({ email: req.body.email });
    // if user is not found in DataBase
    if (!bank) {
        
        return res.status(404).send('Not found');
    }
    if (req.body.withdraw) {
        await Bank.updateOne({ _id: bank._id }, { $inc: { balance: -req.body.withdraw } }
            );
    }
    const newbank = await Bank.findOne({ email: req.body.email });
    res.status(200).send(newbank);

});

router.post("/userProfile", async (req, res) => {
    if(!req.body.email) 
    return res.status(400).send("Bad Request");
    result = await Bank.find({ email: req.body.email });
    //if found
    if (result.length === 0) {
      console.log("not found");
      return res.status(404).send("user is not found");
    }
    return res.status(200).send(result);
  });
  router.post("/search", async (req, res) => {
    if(!req.body.email) 
    return res.status(400).send("Bad Request");
    result = await Bank.find({email: req.body.email});
  
    if (result.length === 0) {
      console.log("not found");
      return res.status(400).send("user is not found");
    }
    console.log(result);
  
    return res.status(200).send(result);
  });


module.exports = router;