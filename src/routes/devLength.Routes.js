const express = require('express');
const router = express.Router();

// Importing jobs controller methods
const { developmentLengthAid } = require('../controllers/devLength.Controller')

router.route('/developmentLength').get(developmentLengthAid);

module.exports = router;