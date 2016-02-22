const express = require('express');
const mongoose = require('mongoose');
// Create Express App
const app = express();
// Set PORT
const PORT = process.env.port || 8888;
// Set DB
const dbString = process.env.MONGO_URI || 'mongodb://samheutmaker:kingpin13@apollo.modulusmongo.net:27017/yvuxe4vU';
// Connect to DB
mongoose.connect(dbString);
// Require MajorA
const m = require('major-a');
// Auth Routes
const mRouter = m.majorRouter;
// Routes
const eventRouter = require(__dirname + '/routes/event-routes');
const searchRouter = require(__dirname + '/routes/search-routes');

// const events12 = require(__dirname + '/util/scrapers/events12');
// events12();

// Set Auth Routes
app.use('/auth', mRouter);
// Event Routes
app.use('/api/events', eventRouter);
// Search Routes
app.use('/api/events/search', searchRouter);
// Start Server
app.listen(PORT, () => {
  console.log('Event-list API live on port ' + PORT);
});
