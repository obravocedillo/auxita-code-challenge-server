const express = require("express");
const sanitize = require('mongo-sanitize'); 
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const mongoUtil = require( '../utils/mongoUtil' );
const db = mongoUtil.getDb();

/**
 * Connection to collections needed
 */
const colletionHypertension = db.collection('hypertension');

/**
 *  reset eGFR readings
 */
router.post('/reset-hypertension-readings', async function (req, res) {
    try {
        const password = sanitize(req.body.password);
        if(password === process.env.password){
            let response = await colletionHypertension.find({}).toArray();
            let restartReadings = await colletionHypertension.updateOne({_id:new ObjectID(response[0]._id)},{
                $set:{
                    hypertensionReadings: []
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
router.post('/save-hypertension-reading', async function (req, res) {
    try {
        const password = sanitize(req.body.password);
        const SysBP = sanitize(req.body.SysBP);
        const DiaBP = sanitize(req.body.DiaBP);
        const atDate = sanitize(req.body.atDate);
        if(password === process.env.password){
            let response = await colletionHypertension.find({}).toArray();
            let responseUpdate = await colletionHypertension.updateOne({_id:new ObjectID(response[0]._id)},{
                $push: {
                    hypertensionReadings: {
                        SysBP: SysBP,
                        DiaBP: DiaBP,
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
router.get('/get-hypertension-readings', async function (req, res) {
    try {
        let response = await colletionHypertension.find({}).toArray();
        res.status(200).send(response[0].hypertensionReadings);
        return;
    } catch (error) {
        console.log(error);
        res.status(500).send("Error in find");  
    }
});

module.exports = router;