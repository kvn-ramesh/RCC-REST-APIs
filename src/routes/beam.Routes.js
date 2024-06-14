const express = require('express');
const router = express.Router();

// Importing jobs controller methods
const { ftrpsrrbs } = require('../controllers/beam.Controller')

router.route('/beams').get(ftrpsrrbs);

module.exports = router;