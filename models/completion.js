const mongoose = require('mongoose');

const completionSchema = new mongoose.Schema({
  completionTime: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Completion', completionSchema); 