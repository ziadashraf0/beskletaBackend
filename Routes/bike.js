const Bike = require("../Models/Bike");
const Station = require("../Models/Station");

const Owner = require("../Models/Owner");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post('/addBike',async (req,res)=>{
    if(!req.body.stationName || !req.body.bikeCategory|| !req.body.bikeColour|| !req.body.bikeSize|| !req.body.bikeCondition|| !req.body.bikeRate||!req.body.ownerSSN)
              return  res.status(404).send("BAD REQUEST");
    // check if the owner exists??
    const owner= await Owner.findOne({SSN:req.body.ownerSSN});
    if(!owner)  return res.status(404).send('Owner is not Found');

    // check if a station with the given name exists??
    const station =await Station.findOne({name:req.body.stationName});
    if(!station) return res.status(404).send('Station is not Found with the given name');

    const bike=new Bike({
        
    ownerSSN:owner.SSN,
    state:"Available" ,
    category: req.body.bikeCategory,
    colour: req.body.bikeColour,
    size: parseInt(req.body.bikeSize),
    condition: req.body.bikeCondition,
    rate: parseFloat(req.body.bikeRate), 
    stationName:station.name   
    });
    
    try{
        const results =await bike.save();
    console.log(results);
    return res.send(results);}
    catch(error){
        console.log('error');
        return res.status(400).send('error');
    }



});
router.post('/viewBike',async (req,res)=>{

    if(!req.body._id) return res.status(400).send("Bad Request");

    const bike= await Bike.findOne({_id:req.body._id});
    if(!bike) return res.status(404).send("Bike was not found");

    return res.status(200).send(bike);

});























module.exports = router;