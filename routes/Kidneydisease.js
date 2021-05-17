const express = require("express");
const sanitize = require('mongo-sanitize'); 
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const mongoUtil = require( '../utils/mongoUtil' );
const db = mongoUtil.getDb();

/**
 * Connection to collections needed
 */
const colletionKidneydisease = db.collection('kidneydisease');

/**
 *  reset eGFR readings
 */
router.post('/reset-eGFR-readings', async function (req, res) {
    try {
        const password = sanitize(req.body.password);
        if(password === process.env.password){
            let response = await colletionKidneydisease.find({}).toArray();
            let restartReadings = await colletionKidneydisease.updateOne({_id:new ObjectID(response[0]._id)},{
                $set:{
                    eGFRReadings: []
                }
            },{upsert: true})
            res.status(200).send('Success');
            return
        }
        res.status(403).send("Password not valid");  
        return;
    } catch (error) {
        console.log(error);
        res.status(500).send("Error in reseting readings");  
    }
});

/**
 *  Save eGFR readings
 */
router.post('/save-eGFR-reading', async function (req, res) {
    try {
        const password = sanitize(req.body.password);
        const eGFR = sanitize(req.body.eGFR)
        const atDate = sanitize(req.body.atDate)
        if(password === process.env.password){
            let response = await colletionKidneydisease.find({}).toArray();
            let responseUpdate = await colletionKidneydisease.updateOne({_id:new ObjectID(response[0]._id)},{
                $push: {
                    eGFRReadings: {
                        eGFR: eGFR,
                        atDate: atDate
                    }
                }
            },{upsert: true})
            res.status(200).send('Success');
            return
        }
        res.status(403).send("Password not valid");  
        return;
    } catch (error) {
        console.log(error);
        res.status(500).send("Error in saving new reading");  
    }
});

/**
 *  Get all eGFR readings
 */
router.get('/get-eGFR-readings', async function (req, res) {
    try {
        let response = await colletionKidneydisease.find({}).toArray();
        res.status(200).send(response[0].eGFRReadings);
        return;
    } catch (error) {
        console.log(error);
        res.status(500).send("Error in find");  
    }
});

module.exports = router;
