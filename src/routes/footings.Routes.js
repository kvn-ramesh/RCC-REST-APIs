const express = require('express');
const router = express.Router();

// Importing jobs controller methods
const { footingDesign } = require('../controllers/footings.Controller')

router.route('/footings').get(footingDesign);

module.exports = router;