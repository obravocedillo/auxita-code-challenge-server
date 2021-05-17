const express = require("express");
const helmet = require("helmet");
const mongoUtil = require( './utils/mongoUtil' );
const cors = require('cors');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());  
app.use(helmet());
app.use(cors());

mongoUtil.connectToServer( ( err ) => {
    // Import routes when the dabatse is already defined
    const kidneydiseaseRouter = require('./routes/Kidneydisease');
    const hypertensionRouter = require('./routes/Hypertension');

    app.use('/kidney', kidneydiseaseRouter);
    app.use('/hypertension', hypertensionRouter);

    /**
    * Close the app and reeturn error message if Mongo cannot bbe opened  
    */  
    if (err) {
        console.log(err);
        app.close();
        return "Error initializing mongo"
    }
})

module.exports = app;