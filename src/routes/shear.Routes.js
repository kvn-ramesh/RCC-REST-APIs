const express = require('express');
const router = express.Router();

// Importing jobs controller methods
const { shearstress } = require('../controllers/shear.Controller')

router.route('/shear').get(shearstress);

module.exports = router;