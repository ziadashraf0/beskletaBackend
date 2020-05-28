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
    if(!req.body.Capacity ||!req.body.Name|| !req.body.Longitude|| !req.body.Latitude)
            return  res.status(400).send("Bad Request");
    //if(parseInt(req.body.numberBikes)> parseInt(req.body.maxCapacity)) return  res.status(400).send("ILLogical Parameters ");
    const result= await Station.findOne({name:req.body.Name});
    if(result)   return  res.status(400).send("Station Name Already in use");
    const tempStation =await Station.findOne({longitude:req.body.Longitude,latitude:req.body.Latitude});
    if(tempStation)   return  res.status(400).send("Station Already exists in this place ");
    
    const station =new Station({
                name:req.body.Name,
                longitude:parseFloat(req.body.Longitude),
                latitude:parseFloat(req.body.Latitude),
                maxCapacity:parseInt(req.body.Capacity),
                //numberBikes:parseInt(req.body.numberBikes),
                numberRides:0       //Default value

    });

    try {
        await station.save();
    } catch (error) {
        console.log(error)
    }; 
    console.log(station);
    return res.status(200).send(station);    

});


router.post("/removeStation", async (req, res) => {
    console.log(req.body);
    result = await Station.findOneAndDelete({name : req.body.name });
  
    if (result.length === 0) {
      console.log("not found");
      return res.status(400).send("station is not found");
    }
    console.log(result);
    return res.status(200).send(result);
  });

  router.put('/edit/stationName', async (req, res) => {

    const station = await Station.findOne({ name: req.body.name });
    if (!station) {
        console.log('sss');

        return res.status(404).send('Not found');
    }
    if (req.body.name) {
        

        await Station.updateOne({ _id: station._id }, { $set: { name: req.body.name } });

    }

    const newstation = await Station.findOne({ name: req.body.name });
    res.status(200).send(newstation);

});
router.put('/edit/stationCapacity', async (req, res) => {

    const station = await Station.findOne({ name: req.body.name });
    if (!station) {
        console.log('sss');

        return res.status(404).send('Not found');
    }
    if (req.body.maxCapacity) {
        

        await Station.updateOne({ _id: station._id }, { $set: { maxCapacity: req.body.maxCapacity } });

    }
    const newstation = await Station.findOne({ name: req.body.name });
    res.status(200).send(newstation);

});

module.exports = router;
