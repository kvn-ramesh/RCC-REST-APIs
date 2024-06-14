const express = require('express');
const app = express();
const dotenv = require('dotenv');

// Setting up config.env file variables
dotenv.config({path : './config/config.env'});

// Importing all routes
const beams = require('./routes/beam.Routes');
const shear = require('./routes/shear.Routes');
const doublyBeam = require('./routes/doublyBeam.Routes');
const footings = require('./routes/footings.Routes');
const developmentLength = require('./routes/devLength.Routes');

app.use('/api/v1',beams);
app.use('/api/v1',shear);
app.use('/api/v1',doublyBeam);
app.use('/api/v1',footings);
app.use('/api/v1',developmentLength);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});
