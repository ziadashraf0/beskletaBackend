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


const timeoutObj = setTimeout(() => {
    console.log('timeout beyond time');
  }, 1500);
  

  
  const intervalObj = setInterval(async() => {
    console.log('time Check');
    //finding rides which are not terminated yet
    const rides=await Ride.find({hasStarted:false});
    if (rides.length===0) return;
    //Creating a new TimeOut Notification
    const notification = new Notification({
        type:"TimeOut",
        viewed:false,
        message:"Your Ride has been Cancelled, because you did not start your ride yet ."
    
    });
    for (let index = 0; index < rides.length; index++) {
        let currentTime = new Date();                        // Getting current time ;
        if((currentTime-rides[index].date)/60000>15) // if the ride was reserved for more than 15 minutes and has not started
                {
                    //set client's state to not available
                   await Client.findOneAndUpdate({userName:rides[index].clientUserName},{$set:{state:"Available"}});
                  // set bike's state to available and isLocked to true and reseting the bike's PIN
                   await Bike.findOneAndUpdate({_id:rides[index].bikeID},{$set:{state:"Available",locked:true,PIN:"XXXX"}});
                   //Incrementimg the number of bikes in the station
                   await Station.updateOne({name:rides[index].departureStation},{$inc:{numberBikes:1}});
                   //Sending a notification to the client to let him know the ride is cancelled
                   await Client.findOneAndUpdate({userName:rides[index].clientUserName},{$push:{Notifications:notification}});
                   //Incrementing number of rides cancelled by the server
                   await Client.findOneAndUpdate({userName:rides[index].clientUserName},{$inc:{ridesCancelledByServer:1}});
                    //Deleting the ride from the DataBase
                   await Ride.findByIdAndDelete({_id:rides[index]._id});                   


                }
    }






  }, 5*60000);








  module.exports = router;