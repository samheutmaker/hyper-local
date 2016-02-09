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


// Create new Express Router and export 
const eventRouter = module.exports = exports = express.Router();

// Get single event
eventRouter.get('/detail/:id', mAuth, (req, res) => {
	// Find event
	Event.findOne({_id: req.params.id}, (err, event) => {
		// Err finding event
		if(err) {
			return res.status(500).json({
				msg: 'There was an error retrieving'
			});
		} 
		// No Event found
		if(!event) {
			return res.status(200).json({
				msg: 'No event found'
			});
		}

		// Track request
		 mTracking.track(event._id, req.user._id);
		 // Return event
		 res.status(200).json({
		 	event: event
		 });
	});	
});

// Post new event, Admin only
eventRouter.post('/new', mAdmin, jsonParser, (req, res) => {
	// Create new event
	var newEvent = new Event(req.body);
	// Save params
	newEvent.name = req.body.name;
	newEvent.description = req.body.description;
	newEvent.date = req.body.date;
	newEvent.postedOn = new Date();
	newEvent.owner_id = req.user._id;
	// Save new event 
	newEvent.save((err, event) => {
		// Error or no data
		if(err || !event) {
			return res.status(500).json({
				msg: 'Error creating event'
			});
		}
		// Create New Tracker
		mTracking.createTracker(event._id, 'event');
		// Return new event data
		res.status(200).json({
			msg: 'Successfully Created',
			event: event
		});
	})
});

	