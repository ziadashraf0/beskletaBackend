const mongoose = require("mongoose");
var BodyParser = require("body-parser");
var cors = require("cors");
const express = require("express");
const router = express.Router();
const Bike = require("../Models/Bike");
const Station = require("../Models/Station");
const Client=require("../Models/Client");
const Ride = require("../Models/Ride");
const Notification = require("../Models/Notification");
const Owner = require("../Models/Owner");
const Bank = require("../Models/Bank");
const twoWeeks=  14*24*60*60000;
const date = require('date-and-time');

const timeoutObj = setTimeout(() => {
    //console.log('timeout beyond time');
  }, 1500);
  

  
  const intervalObj = setInterval(async() => {
    console.log('Distributing Profit Shares');
    const endDate =new Date();                           //End of the period
    const startDate=date.addDays(endDate,-14);         //Calculating the start of the two  weeks

    // finding rides within the current month
    const rides= await Ride.find({isTerminated:true,date: {
        $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
        $lt: new Date(new Date(endDate).setHours(23, 59, 59))
         }});
    const owners=await Owner.find().select({SSN:1,bankAccountNumber:1});        //finding all owners

    for (let index = 0; index < owners.length; index++) {
        let fixedCost=0;
        let variableCost=0;
        var bikes=await Bike.find({ownerSSN:owners[index].SSN}).select({_id:1,ownerSSN:1,rate:1});     //finding owner's bikes
        for(let i=0;i<bikes.length;i++)
             {      //console.log(bikes[i])    
                     fixedCost+=bikes[i].rate*24                   //calculating the fixed cost
                     for(let j=0;j<rides.length;j++){
                            if(parseInt(rides[j].bikeID)===parseInt( bikes[i]._id))
                                {
                                    variableCost+=rides[j].price*0.1;        //calculating the Variable cost= 10% from each ride
                                }
                     }


          
                     
            }
                
            let totalProfit=(fixedCost+variableCost).toFixed(2);    //Calculating total profit share

                
                const notification = new Notification({
                    type:"Profit",
                    viewed:false,
                    message:"Your Profit Share has been transfered to your bank account. Total Amount=  LE: "+totalProfit
                
                });
                //Notifying the owner that his/her profit share has been transfered to his/her bank account
                await Owner.findOneAndUpdate({SSN:owners[index].SSN},{$push:{Notifications:notification}});
                 //Balance Transfer
                 await Bank.findOneAndUpdate({name:"Beskleta"},{$inc:{balance:-1*totalProfit}})
                 await Bank.findOneAndUpdate({bankAccountNumber:owners[index].bankAccountNumber},{$inc:{balance:totalProfit}})


    }






  }, twoWeeks);








  module.exports = router;