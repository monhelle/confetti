const express = require('express');
const router = express.Router();
const completionController = require('../controllers/completionController');

// Get completion status
router.get('/', completionController.getStatus);

// Mark completion
router.post('/complete', express.json(), completionController.markComplete);

module.exports = router; 