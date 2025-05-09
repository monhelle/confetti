const mongoose = require('mongoose');

// Create a separate connection for the tracker database
const trackerConnection = mongoose.createConnection(process.env.TRACKER_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const completionTrackerSchema = new mongoose.Schema({
    ipAddress: {
        type: String,
        required: true
    },
    completionTime: {
        type: Date,
        required: true
    },
    timeTaken: {
        type: String,
        required: true
    }
});

module.exports = trackerConnection.model('CompletionTracker', completionTrackerSchema); 