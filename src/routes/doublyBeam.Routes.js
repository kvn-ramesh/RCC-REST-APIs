const express = require('express');
const router = express.Router();

// Importing jobs controller methods
const { steelPercentage } = require('../controllers/doublyBeam.Controller')

router.route('/doublyBeam').get(steelPercentage);

module.exports = router;