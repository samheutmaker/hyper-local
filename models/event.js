const mongoose = require('mongoose');


const eventSchema = mongoose.Schema({
  name: String,
  date: Date,
  firstDate: String,
  unixDate: Date,
  postedOn: Date,
  owner_id: String,
  source: String,
  description: String,
  linkToMoreInfo: String,
  active: Boolean,
  tags: [String],
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
