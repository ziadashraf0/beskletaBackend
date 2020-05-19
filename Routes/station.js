const Station = require("../Models/Station");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt=require('bcryptjs');

router.get('/stations', async (req,res)=>{

    const stations= await Station.find();
    if(stations.length<1) return res.status(404).send("No stations Found");

    return res.status(200).send(stations);


});

router.post('/addStation',async (req,res)=>{
    if(!req.body.maxCapacity ||!req.body.name|| !req.body.longitude|| !req.body.latitude|| !req.body.numberBikes)
            return  res.status(400).send("Bad Request");
    if(parseInt(req.body.numberBikes)> parseInt(req.body.maxCapacity)) return  res.status(400).send("ILLogical Parameters ");
    const result= await Station.findOne({name:req.body.name});
    if(result)   return  res.status(400).send("Station Name Already in use");
    const tempStation =await Station.findOne({longitude:req.body.longitude,latitude:req.body.latitude});
    if(tempStation)   return  res.status(400).send("Station Already exists in this place ");
    
    const station =new Station({
                name:req.body.name,
                longitude:parseFloat(req.body.longitude),
                latitude:parseFloat(req.body.latitude),
                maxCapacity:parseInt(req.body.maxCapacity),
                numberBikes:parseInt(req.body.numberBikes),
                numberRides:0,       //Default value
                maxAllowedCapacity:parseInt(req.body.maxCapacity)+5

    });

    try {
        await station.save();
    } catch (error) {
        console.log(error)
    }; 
    console.log(station);
    return res.status(200).send(station);    

});





module.exports = router;