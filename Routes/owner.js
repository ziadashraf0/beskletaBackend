const Owner = require("../Models/Owner");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt=require('bcryptjs');

router.post("/IDsearch", async (req, res) => {
  console.log(req.body);
  result = await Owner.find({
    SSN: req.body.ownerSSN
  });

  if (result.length === 0) {
    console.log("not found");
    return res.status(400).send("Owner is not found");
  }
  console.log(result);

  return res.status(200).send(result);
});
router.post("/Delete", async (req, res) => {
  console.log(req.body);
  result = await Owner.findOneAndDelete({
    SSN: req.body.ownerSSN
  });

  if (result.length === 0) {
    console.log("not found");
    return res.status(400).send("Owner is not found");
  }
  console.log(result);

  return res.status(200).send(result);
});
router.post("/", async (req, res) => {
  const results=await Owner.find({$or:[{email:req.body.email},{SSN:req.body.SSN}]});
  if(results.length>0){
    console.log("found");
    return res.status(400).send('SSN or email already in use');
  }
  const owner = new Owner({
    SSN: req.body.SSN,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthDate:req.body.birthDate,
    password:req.body.password,
    phoneNumber:req.body.phoneNumber
  });
  try{const result = await owner.save();
    res.send(result);}
    catch(error){
      console.log('error');
      res.status(400).send(error.message);
      ;
    };
    
  
});

router.post("/login",async (req,res)=>{
  if(!req.body.userName || !req.body.password) return res.status(400).send("Request body is empty");
        


console.log(req.body);
result = await Owner.findOne({ userName: req.body.userName});

//if not found 
if (!result) return res.status(404).send('Owner is not found');

const hash=result.password;
const results= await bcrypt.compare(req.body.password,hash);
    if(results=== true){
          console.log('AUTHORIZED');
          return res.status(200).send('AUTHORIZED');
    }else{
        console.log('Not found');
        return res.status(404).send('Wrong Password');
    }

});


router.post('/signup', async (req,res) => {

   console.log(req.body);
   //look for an Owner with the same name || SSN;
   const result = await Owner.find({$or:[{ SSN: req.body.SSN },{ email: req.body.email },{userName:req.body.userName}] });

   if (result.length > 0) {                
       console.log('already exists');
                  return res.status(400).send('Already  Exists');
   }
   let owner = new Owner({
       SSN: req.body.SSN,
       email: req.body.email,
       password: req.body.password,
       firstName: req.body.firstName,
       lastName:req.body.lastName  ,
       phoneNumber:req.body.phoneNumber,
       birthDate:req.body.birthDate,
       userName:req.body.userName

   });
   try {
       owner = await owner.save();
   } catch (error) {
       console.log(error)
   }; 
   console.log(owner);
   return res.status(200).send(owner);
   
});

router.get('/viewProfile', async (req,res)=>{
  
  console.log(req.body)  
  if(!req.body.SSN)
  {
    return res.status(400).send("Bad Request")
    
  }
  const owner = await Owner.find( { SSN: req.body.SSN }).select({password:0});
  if(owner.length<1)
  {
    return res.status(404).send("Owner was not found");
    
  }
  return res.status(200).send(owner[0]);

});
router.put('/editEmail',async (req,res)=>{
    if(!req.body.SSN || !req.body.email) return res.status(400).send("Bad Request");
    const owner = await Owner.findOne({SSN:req.body.SSN});
    if(!owner) return res.status(404).send("Owner was not found");
    const result =await Owner.findOne({email:req.body.email});
    if(result) return res.status(400).send("Email already in use");

    await Owner.updateOne({_id:owner._id},{$set:{email:req.body.email}});
    const newOwner = await Owner.findOne({ SSN: req.body.SSN });
    console.log(newOwner);
    return res.status(200).send(newOwner);

});

router.put('/editPhoneNumber',async (req,res)=>{
  // if the SSN or the phoneNumber was empty
  if(!req.body.SSN|| !req.body.phoneNumber) return res.status(400).send("Bad Request");
  //if the owner was not found
  const owner = await Owner.findOne({SSN:req.body.SSN});
  if(!owner) return res.status(404).send("Owner was not found");
  
  await Owner.updateOne({_id:owner._id},{$set: {phoneNumber:req.body.phoneNumber}})

  const newOwner = await Owner.findOne({ SSN: req.body.SSN });
  console.log(newOwner);
  return res.status(200).send(newOwner);



});
router.put('/editPassword',async (req,res)=>{
if(!req.body.SSN|| !req.body.password || !req.body.newPassword) return res.status(400).send("Bad Request");

const owner = await Owner.findOne({SSN:req.body.SSN});
if(!owner) return res.status(404).send("Owner was not found");

const hash=owner.password;
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
            await Owner.updateOne({ _id: owner._id }, { $set: { password: hash } });
        });
             
    }

    const newOwner = await Owner.findOne({ SSN: req.body.SSN });
    console.log(newOwner);
    return res.status(200).send(newOwner);





});
router.put('/editBirthDate',async (req,res)=>{
if(!req.body.SSN|| !req.body.birthDate) return res.status(400).send("Bad Request");

const owner = await Owner.findOne({SSN:req.body.SSN});
if(!owner) return res.status(404).send("Owner was not found");

await Owner.updateOne({_id:owner._id},{$set: {birthDate:req.body.birthDate}})

  const newOwner = await Owner.findOne({ SSN: req.body.SSN });
  console.log(newOwner);
  return res.status(200).send(newOwner);


});
router.put('/editUserName',async (req,res)=>{
  if(!req.body.SSN || !req.body.userName) return res.status(400).send('Bad Request');


  const owner= await Owner.findOne({SSN:req.body.SSN});

  if(!owner)    return res.status(404).send('owner was not found');
const temp =await Owner.findOne({userName:req.body.userName});

  if(temp){
    return res.status(400).send('Bad Request userName already in use');
  
  }
  
  
    await Owner.updateOne({ _id: owner._id }, { $set: { userName: req.body.userName } });
  
    const newOwner = await Owner.findOne({ SSN: req.body.SSN });
    console.log(newOwner);
    return res.status(200).send(newOwner);
  
  });
module.exports = router;
