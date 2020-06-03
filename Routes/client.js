const Client = require("../Models/Client");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt=require('bcryptjs');
const Bank = require("../Models/Bank");
const Admin = require("../Models/Admin");
const Bike = require("../Models/Bike");
const Station = require("../Models/Station");
const PromoCode = require("../Models/PromoCode");
const Ride = require("../Models/Ride");
const Notification = require("../Models/Notification");
const date = require('date-and-time');
var moment = require("moment");
const allowedAge =21;
router.post("/IDsearch", async (req, res) => {
  console.log(req.body);
  result = await Client.find({
    SSN: req.body.clientSSN
  });

  if (result.length === 0) {
    console.log("not found");
    return res.status(400).send("Client is not found");
  }
  console.log(result);

  return res.status(200).send(result);
});


router.post("/", async (req, res) => {
  console.log(req.body);
  const client = new Client({
    SSN: req.body.SSN,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber
  });
  const result = await client.save();
  res.send(result);
});
router.post("/add", async (req, res) => {
  console.log(req.body);
  const client = new Client({
    userName:req.body.userName,
    SSN: req.body.SSN,
    email: req.body.email,
    firstName: req.body.firstName,
    password:req.body.password,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    birthDate:req.body.birthDate
   
  });
  const result = await client.save();
  res.send(result);
});

router.post("/emailCheck", async (req, res) => {
  const result = await Client.find({
    $or: [{ SSN: req.body.SSN }, { email: req.body.email }]
  });
  if (result.length > 0) {
    console.log("already exists");
    return res.status(400).send("Already  Exists");
  }
  res.status(200).send("valid");
});
router.post("/signup", async (req, res) => {
  const result = await Client.find({
    $or: [
      { SSN: req.body.SSN },
      { email: req.body.email },
      { userName: req.body.userName }
    ]
  });
  if (result.length > 0) {
    console.log("already exists");
    return res.status(400).send("Already  Exists");
  }
  const birthDate=new Date(req.body.birthDate);


  var clientAge=  parseInt(date.format(new Date(),"YYYY"))-parseInt(date.format(birthDate,"YYYY"));
  
  if(parseInt(date.format(new Date(),"MM"))<parseInt(date.format(birthDate,"MM")))
      clientAge=clientAge-1;
  else if(parseInt(date.format(new Date(),"MM"))===parseInt(date.format(birthDate,"MM")))    {
          if(parseInt(date.format(new Date(),"DD"))<parseInt(date.format(birthDate,"DD")))
                  clientAge=clientAge-1;
  
  
  }

var IsDependent= false;
if(clientAge<allowedAge)
  {
    IsDependent=true;
  }


  let client = new Client({
    SSN: req.body.SSN,
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    birthDate: req.body.birthDate,
    userName: req.body.userName,
    dependents:[],
    //rides:[],
    activated:false,
    isDependent:IsDependent,
    state:'Available',
    Notifications:[]
  });
  try {
    client = await client.save();
    return res.status(200).send(client);

    
  } catch (error) {
    console.log("ERROR");
    return res.status(400).send(error);
  }

  //const results =await Client.update({SSN:req.body.SSN}, { $set: { activated:false,isDependent:IsDependent } });
  //console.log(req.body);

  
});
router.post("/login", async (req, res) => {
 if(!req.body.userName ||!req.body.password ) return res.status(400).send("BAD REQUEST"); 
  result = await Client.findOne({userName: req.body.userName});

  if (!result) return res.status(404).send("Wrong UserName or Password");
  
  const hash = result.password;
  const results = await bcrypt.compare(req.body.password, hash);
  if (results === true) {
    console.log("AUTHORIZED");
    return res.status(200).send("AUTHORIZED");
  } else {
    return res.status(404).send("Wrong UserName or Password");
  }
});


router.post('/viewProfile',async (req,res)=>{
  if(!req.body.userName) return res.status(400).send("Bad Request")
      
    
  const client = await Client.findOne({userName:req.body.userName}).select({password:0});
  if(!client) return res.status(404).send("client was not found");

 return res.status(200).send(client);   
});

router.put('/editEmail',async (req,res)=>{
if(!req.body.SSN || !req.body.email) return res.status(400).send('Bad Request');

const client= await Client.findOne({SSN:req.body.SSN});
if(!client) return res.status(404).send('Client was not found');

const temp =await Client.findOne({email:req.body.email});
if(temp) return res.status(400).send('Bad Request email already in use');

try{ 
   await Client.updateOne({ _id: client._id }, { $set: { email: req.body.email } });
const newClient = await Client.findOne({ SSN: req.body.SSN });
  console.log(newClient);
  return res.status(200).send(newClient);

}catch (error){
  res.status(400).send('ERROR email could not be updated');
}
});
router.put('/editPhoneNumber',async (req,res)=>{
  if(!req.body.SSN || !req.body.phoneNumber) return res.status(400).send('Bad Request');

  const client =await Client.findOne({SSN:req.body.SSN});
  if(!client) return res.status(404).send('Client was not found');

 try{await Client.updateOne({_id:client._id},{$set:{phoneNumber:req.body.phoneNumber}});
 const newClient = await Client.findOne({ SSN: req.body.SSN });
 console.log(newClient);
 return res.status(200).send(newClient);
 }catch(error)
  {
    res.status(400).send('ERROR Phone Number could not be updated');
  }

  });
  
router.put('/editPassword',async (req,res)=>{

  if(!req.body.SSN || !req.body.newPassword|| !req.body.password) return res.status(400).send('Bad Request');
  

const client =await Client.findOne({SSN:req.body.SSN});
if(!client) return res.status(404).send('Client was not found');


    const hash=client.password;
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
            await Client.updateOne({ _id: client._id }, { $set: { password: hash } });
        });
             
    }

    const newClient = await Client.findOne({ SSN: req.body.SSN });
    console.log(newClient);
    return res.status(200).send(newClient);


});

router.put('/editBirthDate',async (req,res)=>{
  if(!req.body.SSN || !req.body.birthDate) return res.status(400).send('Bad Request');

  const client =await Client.findOne({SSN:req.body.SSN});
  if(!client) return res.status(404).send('Client was not found');

  try {
    await Client.updateOne({_id:client._id},{$set:{birthDate:req.body.birthDate}});
  const newClient = await Client.findOne({ SSN: req.body.SSN });
  console.log(newClient);
  return res.status(200).send(newClient); 
  } catch (error) {
    res.status(400).send('ERROR Birth Date could not be updated');

  }
  

  });
router.put('/editUserName',async (req,res)=>{
    if(!req.body.SSN || !req.body.userName) return res.status(400).send('Bad Request');

    const client= await Client.findOne({SSN:req.body.SSN});
    if(!client) return res.status(404).send('Client was not found');
        
      
  const temp =await Client.findOne({userName:req.body.userName});

    if(temp)  return res.status(400).send('Bad Request userName already in use');
try {
   await Client.updateOne({ _id: client._id }, { $set: { userName: req.body.userName } });
    
      const newClient = await Client.findOne({ SSN: req.body.SSN });
      console.log(newClient);
      return res.status(200).send(newClient);
} catch (error) {
  res.status(400).send('ERROR UserName could not be updated');

}
     
    
    });

//Activate client's account 
//Adding payement method (credit Card)
router.put('/activateAccount',async (req,res)=>{
      
  const now = new Date();
  
  if(!req.body.cardValidityDate|| !req.body.cardVerificationCode|| !req.body.cardNumber|| !req.body.SSN) return res.status(400).send('Bad Request');
  
  const currentDate=date.format(now,"YYYY/MM");
  const clientCardvalidityDate= date.format(new Date(req.body.cardValidityDate),"YYYY/MM");
// Checking Card Validity against Expiry Date
  if(currentDate> clientCardvalidityDate)  return res.status(400).send("Your Card is Expired");
// Searching for the card 
  const clientBankAccount =await Bank.findOne({cardVerificationCode:req.body.cardVerificationCode,cardNumber:req.body.cardNumber});
  if(!clientBankAccount) return res.status(404).send("Card is UNauthorized");
  const realValidityDate = date.format(new Date(clientBankAccount.cardValidityDate),"YYYY/MM");
  console.log("realValidityDate "+realValidityDate);
  if(realValidityDate!== clientCardvalidityDate) return res.status(404).send("Card is unauthorized because of the date");
  const bankAccountNumber= clientBankAccount.bankAccountNumber;
 
 //updating clients personnel details
 //Bank Account Number and setting the account to be activated
  try{
            const client =await Client.findOne({SSN:req.body.SSN});
          await Client.updateOne({_id:client._id},{$set:{bankAccountNumber:bankAccountNumber,activated:true}});
          const result=await Client.findOne({_id:client._id});
          return res.status(200).send(result);
  }catch(error){
    console.log("error");
    return res.status(400).send("Failed to Activate Account");
  }

});
router.put('/activateDependentAccount',async(req,res)=>{
    if(!req.body.parentEmail|| !req.body.parentSSN|| !req.body.dependentUserName ||!req.body.dependentEmail) return res.status(400).send("BAD REQUEST");

    const parent=await Client.findOne({SSN:req.body.parentSSN,email:req.body.parentEmail});
    if(!parent) return res.status(404).send("Parent was not found");
    // chech that parent account is not a parent account or the parent account is not activated 
    if(parent.isDependent || !parent.activated) return res.status(400).send("Your Parent is Underaged Or Not Activated");
    const dependent=await Client.findOne({userName:req.body.dependentUserName});
    if(!dependent)  return res.status(404).send("Dependent is not found");
    if(dependent.awaitingConfirmation) return res.status(401).send("Your activation request has been sent before")
const notification = new Notification({
          type:"Dependent Request",
          viewed:false,
          message:"Do you accept "+ req.body.dependentUserName+ " to be your son",
          dependentEmail:req.body.dependentEmail
   
  });
  try{
const result =await Client.updateOne({_id:parent._id},{$push:{Notifications:notification}});
await Client.updateOne({userName:req.body.dependentUserName},{$set:{awaitingConfirmation:true}});
return res.status(200).send();
  }catch(error){
    console.log(error);
    return res.status(400).send("error");
  }


});
router.put('/confirmingDependent',async(req,res)=>{

  if(!req.body.email|| !req.body.dependentEmail) return res.status(400).send("BAD Request");

  const parent= await Client.findOne({email:req.body.email});
  if(!parent) return res.status(404).send("parent was not found");
  const dependent= await Client.findOne({email:req.body.dependentEmail});
  if(!dependent) return res.status(404).send("dependent was not found");  
  const notification = new Notification({
    type:"Request Confirmed",
    viewed:false,
    message:"Your Account is activated by your parent"

});

  try{
      await Client.updateOne({_id:parent._id},{$push:{dependents:dependent._id}});
      await Client.updateOne({_id:dependent._id},{$set:{parentID:parent._id}});
      await Client.updateOne({_id:dependent._id},{$push:{Notifications:notification}});
      await Client.updateOne({_id:dependent._id},{$set:{activated:true}});

      return res.status(200).send();
  }catch(error)
{
  console.log(error);
  return res.status(400).send("ERROR");
}


});
router.post('/requestRide',async (req,res)=>{
  const randomPIN= parseInt(Math.random()*10000);
  console.log(randomPIN);
  if(!req.body.SSN || !req.body.userName|| !req.body.stationName || !req.body.bikeID) return res.status(404).send("BAD REQUEST");
  // checking if a client exists
  const client= await Client.findOne({SSN:req.body.SSN,userName:req.body.userName,state:'Available'});
  if(!client) return res.status(400).send("Client was not found or is NOT AVAILABLE");
  // Chhecking if the client's account is activated
  if(!client.activated) return res.status(404).send("Client is not activated");
  
  //checking if the bike is available or not
  const bike=await Bike.findOne({_id:req.body.bikeID,stationName:req.body.stationName,state:'Available'});
  if(!bike) return res.status(404).send("Bike was not found or It was found NOT AVAILABLE at the moment ");

  if(bike.state === 'Available'){
      
        try{
                //Update bike to be Not Available
                await Bike.updateOne({_id:bike._id},{$set:{state:'Not Available'}});

                const notification = new Notification({
                  type:"Ride Request",
                  viewed:false,
                  message:"Your Ride Request is Confirmed.  Use the PIN Code to Unlock your Bike.  PIN:"+ randomPIN
              
              });
  
                    
              await Client.updateOne({_id:client._id},{$push:{Notifications:notification}});
              await Client.updateOne({_id:client._id},{$set:{state:'Not Available'}});

              await Station.updateOne({name:req.body.stationName},{$inc:{numberBikes:-1}});
              await Bike.updateOne({_id:bike._id},{$set:{PIN:randomPIN}});

              const ride = new Ride({
                bikeID:bike._id,
                departureStation:req.body.stationName,
                clientUserName:req.body.userName
            });
            await ride.save();
              
                                return res.send("OK");
        }catch(error){
          return res.status(400).send("ERROR");
        }
  }else{
    return res.status(404).send("Bike is NOT AVAILABLE at the moment");
  }

});

router.post('/viewNotifications',async(req,res)=>{
  if(!req.body.userName) return res.status(400).send("BAD REQUEST");
  const client=await Client.findOne({userName:req.body.userName});
  if(!client) return res.status(404).send("Client was not found");

  return res.status(200).send(client.Notifications);

});
router.post('/viewRides',async (req,res)=>{
    if(!req.body.userName)   return res.status(400).send("BAD REQUEST");
    const clientRides=await Ride.find({clientUserName:req.body.userName,isTerminated:true});
    if(clientRides.length===0) return res.status(404).send("No rides were found");
  
    return res.status(200).send(clientRides);

});
router.post('/startRide',async(req,res)=>{

    if(!req.body.userName || !req.body.PIN) return res.status(400).send("BAD REQUEST");
    const ride= await Ride.findOne({clientUserName:req.body.userName,hasStarted:false});
    if(!ride) return res.status(404).send("Ride was not found");
    const currentDate=new Date();
    const bike=await Bike.findOne({_id:ride.bikeID});
  if(!bike ) return res.status(400).send("Bike was not found");
  if(bike.locked===false) return res.status(400).send("Bike was unLocked");
  if(req.body.PIN!==bike.PIN) return res.status(400).send("The PIN you entered is INCORRECT");

  
     await Ride.findOneAndUpdate({_id:ride._id},{$set:{hasStarted:true,date:currentDate}});  //set ride to be started AND update the starting date
     await Bike.findOneAndUpdate({_id:ride.bikeID},{$set:{stationName:"Riding",locked:false}});     // updating the bike's current station 
     return res.status(200).send("Let's GO");
    
  

});
router.put('/selectDestinationStation',async(req,res)=>{

  if(!req.body.userName || !req.body.destinationStationName ) return res.status(400).send("BAD REQUEST");
const currentRide= await Ride.findOne({clientUserName:req.body.userName,hasStarted:true,isTerminated:false});   //search for the client's current ride
if(!currentRide) return res.status(404).send('Your current ride was not found');  
const destinationStation =await Station.findOne({name:req.body.destinationStationName});   //search for the selected destination station
if(!destinationStation) return res.status(404).send('Wrong station Name');

if(destinationStation.numberBikes>= destinationStation.maxAllowedCapacity)
  return res.status(400).send("The selected Station has no empty slots,Please select another station");
  try {
    await Station.findOneAndUpdate({_id:destinationStation._id},{$inc:{numberBikes:1}});  //Incrementing station's number of bikes by 1
    await Ride.findOneAndUpdate({_id:currentRide._id},{$set:{arrivalStation:req.body.destinationStationName}});  //Updates ride's arrival station
  return res.status(200).send("OK");
  } catch (error) {
    return res.status(400).send("Error");

  }
  


});
router.put('/terminateRide',async(req,res)=>{
if(!req.body.userName) return res.status(400).send("BAD REQUEST");
const currentRide =await Ride.findOne({clientUserName:req.body.userName,isTerminated:false,hasStarted:true}); //finding current ride

if(!currentRide) return res.status(404).send("Your current ride was not found");
const bike=await Bike.findOne({_id:currentRide.bikeID});        //finding bike
if(!bike) return res.status(404).send("bike was not found");
let client =await Client.findOne({userName:req.body.userName});     //finding client

if(!client) return res.status(404).send("Client was not found");

let discount=0;
if(client.promoCode) {
       if(isPromoCodeValid(client.promoCode)){
               let clientPromoCode=client.promoCode;
                  discount=client.promoCode.discountPercentage/100;
                  clientPromoCode.numberOfRidesAvailable=clientPromoCode.numberOfRidesAvailable-1;
                  console.log(clientPromoCode);
                  await Client.findByIdAndUpdate({_id:client._id},{$set:{promoCode:clientPromoCode}});
                }
    }

console.log(discount)
var bankAccountNumber;
if(client.isDependent){
  const parent=await Client.findOne({_id:client.parentID});
  if(!parent)  return res.status(404).send("Parent was not found");
   bankAccountNumber=parent.bankAccountNumber;
}
else{
  bankAccountNumber=client.bankAccountNumber;
}
const beskletaBankAccount= await Bank.findOne({name:"Beskleta"});
if(!beskletaBankAccount){
  const now = new Date();
  const validityDate = date.addYears(now, 3);
  const newBankAccount = new Bank({
      email:"owner@Beskleta.com",
      password:"1234",
      PIN:"1234",
      name:"Beskleta",
      balance:parseFloat(1000000),
      cardValidityDate:validityDate
  });
  await newBankAccount.save();

}

const rideDuration=calculateDuration(currentRide.date,new Date()).toFixed(2);    //calculating ride's duration
const rideCost=(rideDuration*bike.rate/60*(1-discount)).toFixed(2);                          //calculating ride's price
console.log(bankAccountNumber)
try {
  await Ride.findOneAndUpdate({_id:currentRide._id},{$set:{duration:rideDuration,isTerminated:true,price:rideCost}});  //Updates ride's duration
  await Bike.findOneAndUpdate({_id:currentRide.bikeID},{$inc:{numberOfRides:1}});  //Updates ride's arrival station
  await Bike.findOneAndUpdate({_id:currentRide.bikeID},{$set:{stationName:currentRide.arrivalStation,state:"Available",locked:true,PIN:'XXXX'}});  //Updates ride's arrival station
//Balance Transfer
  await Bank.findOneAndUpdate({bankAccountNumber:bankAccountNumber},{$inc:{balance:rideCost*-1}});  //withdraw ride's cost from the client's bankAccount
  await Bank.findOneAndUpdate({name:"Beskleta"},{$inc:{balance:rideCost}});  //Deposit ride's cost to the Beskleta's bankAccount

  await Client.findOneAndUpdate({_id:client._id},{$set:{state:'Available'}});  //Updates ride's arrival station
  await Station.findOneAndUpdate({name:currentRide.departureStation},{$inc:{numberRides:1}});  //Updates ride's arrival station


                const notification = new Notification({
                  type:"Ride Terminated",
                  viewed:false,
                  message:"This is the end of your ride. Price: "+rideCost
              
              });
  
                    
              await Client.updateOne({_id:client._id},{$push:{Notifications:notification}});

return res.status(200).send("OK");

} catch (error) {
  console.log(error)
  return res.status(400).send("Error");

}


});

router.put('/rejectDependentRequest',async (req,res)=>{
  if(!req.body.dependentEmail) return res.status(400).send("Bad Request");
  const client =await Client.findOne({email:req.body.dependentEmail});
  if(!client) return res.status(404).send("Dependent was not found");

  const notification = new Notification({
    type:"Activation Request Rejection",
    viewed:false,
    message:"Your Activation request has been rejected"

});
await Client.updateOne({_id:client._id},{$push:{Notifications:notification}});
await Client.updateOne({_id:client._id},{$set:{awaitingConfirmation:false}});


return res.status(200).send("OK")

});
router.post("/deleteNotification", async (req, res) => {
  var ObjectId = require("mongodb").ObjectID;

  if (!req.body.userName || !req.body.notificationID)
    return res.status(404).send("BAD REQUEST");
  const client = await Client.findOne({ userName: req.body.userName });
  if (!client) return res.status(404).send("Client was not found");
  const notifications = await Client.updateOne(
    { _id: client._id },
    {
      $pull: { Notifications: { _id: ObjectId(req.body.notificationID) } }
    }
  );
  if (notifications.nModified != 0) {
    return res.status(200).send(notifications);
  } else {
    return res.status(404).send("cannot delete");
  }
});
//Rating Last Terminated Ride
router.put('/rateRide',async(req,res)=>{
      if(!req.body.rating ||!req.body.userName) return res.status(400).send("BAD REQUEST");
      const rides=await Ride.find({clientUserName:req.body.userName,isTerminated:true}).sort({rideNumber:1});
      if(rides.length===0)  return res.status(404).send("No rides were found");
      if(req.body.rating>5|| req.body.rating<0) return res.status(401).send("Rating value is out of range");
    await Ride.findByIdAndUpdate({_id:rides[rides.length-1]._id},{$set:{rating:req.body.rating}});
    return res.send("OK");
  });   
router.put('/activatePromoCode',async(req,res)=>{
      if(!req.body.userName ||!req.body.promoCode)   return res.status(400).send("BAD REQUEST");
       const promoCode=await PromoCode.findOne({code:req.body.promoCode});
       if(!promoCode) return res.status(404).send("Incorrect code or promo code is not valid any more");
       if(!isPromoCodeValid(promoCode))  return res.status(401).send("Promo code is not valid any more");

       let newPromoCode = new PromoCode({
        description:"Use this PromoCode: "+promoCode.code+" to get a Discount: "+promoCode.discountPercentage +"% " +" for the next "+promoCode.numberOfRidesAvailable +" Rides "+"Valid to: "+date.format(promoCode.validityDate,"DD/MM/YYYY"),
        code:promoCode.code,
        numberOfRidesAvailable:promoCode.numberOfRidesAvailable,
        discountPercentage:promoCode.discountPercentage,
        validityDate:promoCode.validityDate
        
        });
       await Client.findOneAndUpdate({userName:req.body.userName},{$set:{promoCode:newPromoCode}});
      
       return res.send("OK")


});
router.put('/cancelRideRequest',async(req,res)=>{
      if(!req.body.userName) return res.status(400).send("BAD REQUEST");
      const ride=await Ride.findOne({clientUserName:req.body.userName,hasStarted:false});
      if(!ride) return res.status(400).send("NO rides requested found to cancel");
      await Client.findOneAndUpdate({userName:req.body.userName},{$set:{state:'Available'}});
      await Bike.findByIdAndUpdate({_id:ride.bikeID},{$set:{state:'Available',PIN:'XXXX'}});
      await Station.findOneAndUpdate({name:ride.departureStation},{$inc:{numberBikes:1}});
      await Ride.findOneAndDelete({_id:ride._id});

      const notification = new Notification({
        type:"Ride Cancelled",
        viewed:false,
        message:"Your ride has been cancelled"
    
    });

          
    await Client.updateOne({userName:req.body.userName},{$push:{Notifications:notification}});


return res.send("OK");
});

router.post('/reportProblem',async(req,res)=>{
        if(!req.body.report) return res.status(400).send("BAD REQUEST");
      const admins=await Admin.find();
      if(admins.length===0)  res.status(404).send("Admins are not found");
      
      const report = new Notification({
        type:"Report",
        viewed:false,
        message:req.body.report
    
    });

          

      for (let index = 0; index < admins.length; index++) {

        await Admin.findOneAndUpdate({_id:admins[index]._id},{$push:{reports:report}});
      }
      return res.send(report);

});
module.exports = router;
function calculateDuration(startDate,endDate)
{
  
   var start_date = moment(startDate, 'YYYY-MM-DD HH:mm:ss');
   var end_date = moment(endDate, 'YYYY-MM-DD HH:mm:ss');
   var duration = moment.duration(end_date.diff(start_date));
   var minutes = duration.asMinutes();       
   return minutes;
}
function isPromoCodeValid(promoCode)
{
  let now=new Date()

    if(now.getTime()<promoCode.validityDate.getTime() && promoCode.numberOfRidesAvailable>0)
        return true  ;
        return false;
}
