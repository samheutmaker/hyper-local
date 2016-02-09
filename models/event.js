const mongoose = require('mongoose');


const eventSchema = mongoose.Schema({
  name: String,
  date: Date,
  postedOn: Date,
  owner_id: String,
  description: String,
  linkToMoreInfo: String,
  tags: Array,
  location: {
    area: String,
    address: String,
    coords: {
      lat: Number,
      lng: Number
    }
  }
});



module.exports = exports = mongoose.model('events', eventSchema);
