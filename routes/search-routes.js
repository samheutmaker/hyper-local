const express = require('express');
// Require Json Parser to handle POST
const jsonParser = require('body-parser').json();
// Require Event model
const Event = require(__dirname + '/../models/event.js');
// Require MajorA
const majorA = require('major-a');
// Require MajorA Analytics
const mTracking = majorA.majorAnalytics;
// Require MajorA Auth
const mAuth = majorA.majorAuth;
// Require MajorA Admin
const mAdmin = majorA.majorAdmin;
// Error
const e = require(__dirname + '/../lib/errors/errors');


// Create new Express Router and export
const searchRouter = module.exports = exports = express.Router();

// Get event tracker
searchRouter.get('/tracking', mAuth(), (req, res) => {
  Event.find({
    owner_id: req.user._id
  }, (err, events) => {
    // DB Error
    if (err) return e.dbSaveError(err, res);
    // No Results
    if (!events.length) return e.noContent(res);
    // Get event Ids
    var eventIds = events.map((event, eventIndex) => {
      return event._id;
    });

    // Get all tracking data
    mTracking.getTrackers(eventIds).then((trackers) => {
      res.status(200).json(trackers);
    });
  });
});

// Get all events
searchRouter.get('/', (req, res) => {
  Event.find({
    active: true
  }, (err, events) => {
    if (err) return res.status(500).json({
        msg: 'Error retreiving events'
      })
      // Respond with events
    res.status(200).json(events);
  });
});


// Search by query
searchRouter.post('/query', jsonParser, (req, res) => {
  Event.find({
    active: true,
    tags: {
      $in: req.body.queryArray
    }
  }, (err, events) => {
    // DB Error
    if (err) return e.dbFindError(err, res);
    // No Results
    if (!events.length) return e.noContent(res);
    // Respond with events
    res.status(200).json(events);
  });
});


// Search by time period
searchRouter.post('/interval', jsonParser, (req, res) => {
  Event.find({
    active: true,
    unixDate: {
      $gte: Date.parse(req.body.from),
      $lt: Date.parse(req.body.to)
    }
  }, (err, events) => {
    // DB Error
    if (err) return e.dbFindError(err, res);
    // No Results
    if (!events.length) return e.noContent(res);
    // Respond with events
    res.status(200).json(events);
  });
});