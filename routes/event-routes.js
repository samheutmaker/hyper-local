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

// Get all events
eventRouter.get('/', mAuth(true), (req, res) => {
	Event.find({
		active: true
	}, (err, events) => {
		if (err) return res.status(500).json({
			msg: 'Error retreiving events'
		})

		res.status(200).json({
			msg: 'Successfully retrieved',
			events: events
		});
	});
});

// Get user event Tracker
eventRouter.get('/tracking', mAuth(), (req, res) => {
	Event.find({
		owner_id: req.user._id
	}, (err, events) => {
		if (err) {
			return res.status(500).json({
				msg: 'There was an error retreiving these events'
			})
		}
		// Check if results found
		if (!events.length) {
			return res.status(200).json({
				msg: 'No Events Found'
			})
		}

		var eventIds = events.map((event, eventIndex) => {
			return event._id;
		});

		mTracking.getTrackers(eventIds).then((trackers) => {
			res.status(200).json({
				msg: 'Trackers found',
				trackers: trackers
			});
		});
	});
});

// Search by time period
eventRouter.post('/interval', mAuth(true), jsonParser, (req, res) => {
	Event.find({
		active: true,
		unixDate: {
			$gte: new Date(Date.parse(req.body.from)),
			$lt: new Date(Date.parse(req.body.to))
		}
	}, (err, events) => {
		// Check for error
		if (err) {
			return res.status(500).json({
				msg: 'There was an error retreiving these events'
			})
		}
		// Check if results found
		if (!events.length) {
			return res.status(200).json({
				msg: 'No Events Found'
			})
		}
		// Return events
		res.status(200).json({
			msg: 'Succesful',
			events: events
		});
	});
});

// Search by query
eventRouter.post('/search', mAuth(true), jsonParser, (req, res) => {
	Event.find({
		active: true,
		tags: {
			$in: req.body.queries
		}
	}, (err, events) => {
		// Check for error
		if (err) {
			return res.status(500).json({
				msg: 'There was an error retreiving these events'
			})
		}
		// Check if results found
		if (!events.length) {
			return res.status(200).json({
				msg: 'No Events Found'
			})
		}
		// Return events
		res.status(200).json({
			msg: 'Succesful',
			events: events
		});
	});
});

// Gets all the events that belong to a user
eventRouter.get('/user/:id', mAuth(true), (req, res) => {
	Event.find({
		owner_id: req.params.id,
		active: true
	}, (err, events) => {
		if (err) {
			return res.status(500).json({
				msg: 'There was an error retreiving these events'
			})
		}
		if (!events) {
			return res.status(200).json({
				msg: 'No Events found'
			});
		}
		res.status(200).json({
			msg: 'Success',
			events: events
		});
	});
});

// Get single event
eventRouter.get('/detail/:id', mAuth(true), (req, res) => {
	// Find event
	Event.findOne({
		_id: req.params.id,
		active: true
	}, (err, event) => {
		// Err finding event
		if (err) {
			return res.status(500).json({
				msg: 'There was an error retrieving'
			});
		}
		// No Event found
		if (!event) {
			return res.status(200).json({
				msg: 'No event found'
			});
		}

		// Track request
		if (req.user._id) {
			mTracking.trackLoggedIn(event._id, req.user._id);
		} else {
			mTracking.trackAnon(event._id);
		}
		// Return event
		res.status(200).json({
			event: event
		});
	});
});


// Post new event, Admin only
eventRouter.post('/new', mAuth(), jsonParser, (req, res) => {
	// Create new event
	var newEvent = new Event(req.body);
	// Save params
	newEvent.name = req.body.name;
	newEvent.description = req.body.description;
	newEvent.date = req.body.date;
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
		// Return new event data
		res.status(200).json({
			msg: 'Successfully Created',
			event: event
		});
	});
});

// Delete route == sets active property to false, does not actually delete
eventRouter.delete('/delete/:id', mAuth(), (req, res) => {
	console.log(req.user._id);
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
			data: removeData
		});
	});
});