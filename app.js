const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const completionRoutes = require('./routes/completion');
const instructionsRoutes = require('./routes/instructions');
const testRouter = require('./routes/test');
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static('public'));

// Routes
app.use('/', completionRoutes);
app.use('/instructions', instructionsRoutes);
app.use('/test', testRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 