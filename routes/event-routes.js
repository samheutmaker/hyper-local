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
const eventRouter = module.exports = exports = express.Router();


// Gets all the events that belong to a user
eventRouter.get('/user/:id', mAuth(true), (req, res) => {
  Event.find({
    owner_id: req.params.id,
    active: true
  }, (err, events) => {
    // DB Error
    if (err) return e.dbSaveError(err, res);
    // No Results
    if (!events.length) return e.noContent(res);
    // Respond with events
    res.status(200).json(events);
  });
});

// Get single event
eventRouter.get('/detail/:id', mAuth(true), (req, res) => {
  // Find event
  Event.findOne({
    _id: req.params.id,
    active: true
  }, (err, event) => {
    // DB Error
    if (err) return e.dbSaveError(err, res);
    // No Results
    if (!event) return e.noContent(res);
    // Track request
    if (req.user._id && event._id) {
      mTracking.trackLoggedIn(event._id, req.user._id);
    } else if(event._id) {
      mTracking.trackAnon(event._id);
    }
    // Respond with event
    res.status(200).json(event);
  });
});


// Post new event
eventRouter.post('/create', mAuth(), jsonParser, (req, res) => {
  // Create new event
  var newEvent = new Event(req.body);
  // Save params
  newEvent.name = req.body.name;
  newEvent.description = req.body.description;
  newEvent.unixDate = req.body.unixDate;
  newEvent.tags = req.body.tags;
  newEvent.postedOn = new Date();
  newEvent.owner_id = req.user._id;
  newEvent.active = true;
  // Save new event
  newEvent.save((err, event) => {
    // Error or no data
    if (err || !event) {
      return res.status(500).json({
        msg: 'Error creating event'
      });
    }
    // Create New Tracker
    mTracking.createTracker(event._id, 'event');
    // Respond with event
    res.status(200).json(event);
  });
});


// Update Event
eventRouter.put('/update/:id', mAuth(), (req, res) => {
  Event.update({
    _id: req.params.id
  }, req.body, (err, event) => {
    // DB Error
    if (err) return e.dbSaveError(err, res);
    // No Results
    if (!event) return e.noContent(res);
    //Send event
    res.status(200).json({
    	msg: 'Updated.'
    });
  });
});

// Delete route -- sets active property to false, does not actually delete
eventRouter.delete('/delete/:id', mAuth(), (req, res) => {
  Event.update({
    _id: req.params.id,
    owner_id: req.user._id,
    active: true
  }, {
    $set: {
      active: false
    }
  }, (err, removeData) => {
    if (err || !removeData) {
      return res.status(500).json({
        msg: 'There was an error deleting'
      });
    }
    // Check whether an event was removed
    var msg = (removeData.n == "0") ? 'This is not your event' :
      'Successfully Removed';

    res.status(200).json({
      msg: msg,
      removed: removeData
    });
  });
});