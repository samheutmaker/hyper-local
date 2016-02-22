const mongoose = require('mongoose');


const eventSchema = mongoose.Schema({
  name: String,
  date: String,
  unixDate: String,
  lastDate: String,
  postedOn: Date,
  owner_id: String,
  source: String,
  description: String,
  cost: String,
  free: Boolean,
  linkToMoreInfo: String,
  linkToTicketInfo: String,
  phone: String,
  active: Boolean,
  tags: [String],
  repeat: {
   monthly: {
    day: String,
    time: String
   },
   weekly: {
    day: String,
    time: String
   }
  },
  location: {
    venue: String,
    area: String,
    address: String,
    coords: {
      latitude: Number,
      longitude: Number
    }
  }
});



module.exports = exports = mongoose.model('events', eventSchema);
