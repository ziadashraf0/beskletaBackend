const Admin = require("../Models/Admin");
const PromoCode = require("../Models/PromoCode");
const Client = require("../Models/Client");
const Notification = require("../Models/Notification");

const STRING = require('@supercharge/strings')
const date = require('date-and-time');
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt=require('bcryptjs');

router.get('/', async (req, res) => {
    console.log(req.body);
    const admin = await Admin.find();
    console.log(admin);
    res.send(admin);
});
router.post('/signup', async (req,res) => {
   /// console.log('posting');
    console.log(req.body);
    //look for an Admin with the same name || SSN;
    const result = await Admin.find({           
        $or:[{ SSN: req.body.SSN },
            { userName: req.body.name },
            { email: req.body.email }] });

    if (result.length > 0) {                
        console.log('already exists');
                   return res.status(400).send('Already  Exists');
    }
    let admin = new Admin({
        SSN: req.body.SSN,
        email: req.body.email,
        password: req.body.password,
        userName: req.body.name,  

    });
    try {
        admin = await admin.save();
    } catch (error) {
        console.log(error)
    };
   
    res.status(200).send(admin);
    console.log(admin);
});

///Edit Admin Email
router.put('/edit/email', async (req, res) => {
    console.log(req.body);

    const admin = await Admin.findOne({ userName: req.body.userName });
    // if admin is not found in DataBase
    
    if (!admin) return res.status(404).send('Not found');

    if (req.body.email) {

        let results = await Admin.find({ email: req.body.email });
        if (results.length>0) {

            console.log(results);
            console.log('Email already taken');
            return res.status(400).send('Email already taken');
        }
        console.log(results);
        await Admin.updateOne({ _id: admin._id }, { $set: { email: req.body.email } });
        
       
    } 
        
    const newadmin = await Admin.findOne({ userName: req.body.userName });
    console.log(newadmin);
    res.status(200).send(newadmin);






});
//Edit Phone Number
router.put('/edit/phone', async (req, res) => {

    const admin = await Admin.findOne({ userName: req.body.userName });
    // if admin is not found in DataBase
    if (!admin) {
        console.log('sss');

        return res.status(404).send('Not found');
    }
    if (req.body.phoneNumber) {
        

        await Admin.updateOne({ _id: admin._id }, { $set: { phoneNumber: req.body.phoneNumber } });

    }

    const newadmin = await Admin.findOne({ userName: req.body.userName });
    res.status(200).send(newadmin);

});

router.put('/edit/birthDate', async (req, res) => {
    console.log(req.body);
    const admin = await Admin.findOne({ userName: req.body.userName });
    // if admin is not found in DataBase
    if (!admin) {
              return res.status(404).send('Not found');
    }
    if (req.body.birthDate) {


        await Admin.updateOne({ _id: admin._id }, { $set: { birthDate: req.body.birthDate } });

    } else {
        return res.status(400).send('BirthDate is required !!');
    }

    const newadmin = await Admin.findOne({ userName: req.body.userName });
    res.status(200).send(newadmin);

});
router.post('/login', async (req, res) => {
    console.log(req.body);
    result = await Admin.find({ userName: req.body.userName});

    //if not found 
    if (result.length === 0) {
        console.log('not found');
        return res.status(404).send('Admin is not found');
    }
    const hash=result[0].password;
    const results= await bcrypt.compare(req.body.password,hash);
        if(results=== true){
              console.log('AUTHORIZED');
        return res.status(200).send('AUTHORIZED');
        }else{
            console.log('Not found');
        return res.status(404).send('Admin is not found');
        }
    });
    



router.put('/edit/password', async (req, res) => {
 
    const admin = await Admin.findOne({ userName: req.body.userName});
    // if admin is not found in DataBase

    if (!admin) return res.status(404).send('Admin is Not Found');
    const hash=admin.password;
    const results= await bcrypt.compare(req.body.password,hash);

    if(!results)
    {
        console.log('wrong Password');
        return res.status(404).send('Wrong Password');
    }
    //check if oldPassword=== newPassword
    const check= await bcrypt.compare(req.body.newPassword,hash);
    if(check === true){
        console.log('newPassword and oldPassword do match');
        return res.status(400).send('newPassword and oldPassword do match');
    }

    if(req.body.newPassword){
        //hashing the new password
        bcrypt.hash(req.body.newPassword, 10).then(async (hash)=>{
            //updating the password
            await Admin.updateOne({ _id: admin._id }, { $set: { password: hash } });
        });
             
    }

    const newadmin = await Admin.findOne({ userName: req.body.userName });
    console.log(newadmin);
    res.status(200).send(newadmin);


});

router.post("/adminProfile", async (req, res) => {
    console.log(req.body);
    result = await Admin.find({ userName: req.body.userName });
  
    //if found
    if (result.length === 0) {
      console.log("not found");
      return res.status(404).send("Admin is not found");
    }
  
    return res.status(200).send(result);
  });

  router.post('/sendPromoCodes',async(req,res)=>{
    
    if(!req.body.numberOfRidesAvailable||!req.body.discountPercentage) return res.status(400).send("BAD REQUEST");
    if(req.body.discountPercentage>100||req.body.discountPercentage<0) return res.status(401).send("Discount percentage is out of range");
    
    let validityDate=new Date();  validityDate.setDate(validityDate.getDate()+7);    validityDate.setHours(23, 59, 59)
    let flag=1;
    let randomString=""
    while (true) {
         randomString=STRING.random(10)
        let temp=await PromoCode.findOne({code:randomString});
        if(!temp) break;}       



    let promoCode = new PromoCode({
        
        description:"Use this PromoCode: "+randomString+" to get a Discount: "+req.body.discountPercentage +"% " +" for the next "+req.body.numberOfRidesAvailable +" Rides "+"Valid to: "+date.format(validityDate,"DD/MM/YYYY"),
    code:randomString,
    numberOfRidesAvailable:req.body.numberOfRidesAvailable,
    discountPercentage:req.body.discountPercentage,
    validityDate:validityDate
    
    });
    const result=await promoCode.save();
    const notification = new Notification({
        type:"PromoCode",
        viewed:false,
        message:"Use this PromoCode: "+randomString+" to get a Discount: "+req.body.discountPercenatge +"% " +" for the next "+req.body.numberOfRidesAvailable +" Rides "+"Valid to: "+date.format(validityDate,"DD/MM/YYYY")
    
    });
    const clients=await Client.find({activated:true});
    if(clients.length===0)  return res.status(404).send("No Clients were found");
    for (let index = 0; index < clients.length; index++) {
        await Client.updateOne({_id:clients[index]._id},{$push:{Notifications:notification}});
    }
    
    return res.status(200).send(result)
  });
module.exports = router;