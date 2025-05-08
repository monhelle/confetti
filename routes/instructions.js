const express = require('express');
const router = express.Router();
const instructionsController = require('../controllers/instructionsController');

// Get instructions page
router.get('/', instructionsController.getInstructions);

module.exports = router; 