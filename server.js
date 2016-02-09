const express = require('express');
const mongoose = require('mongoose');

// Create Express App
const app = express();
// Set static directory
app.use(express.static(__dirname + '/www'));
// Set PORT
const PORT = process.env.port || 8888;
// Connect to DB
mongoose.connect(
  'mongodb://samheutmaker:kingpin13@apollo.modulusmongo.net:27017/yvuxe4vU');
// Require MajorA
const m = require('major-a');
const mRouter = m.majorRouter;
const eventRouter = require(__dirname + '/routes/event-routes');

const events12 = require(__dirname + '/lib/scrapers/events12');
events12();

// Set Auth Routes
app.use('/auth', mRouter);
app.use('/events', eventRouter);
// Start Server
app.listen(PORT, () => {
  console.log('Live on PORT ' + PORT);
});
