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
// Require Auth Routes
const authRoutes = require(__dirname + '/routes/auth-routes');
// Set Auth Routes
app.use('/auth', authRoutes);
// Start Server
app.listen(PORT, () => {
  console.log('Live on PORT ' + PORT);
});
