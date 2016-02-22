// Errors
const e = require(__dirname + '/../errors/errors');

// Set up geo-coder
const geocoderProvider = 'google';
const httpAdapter = 'https';
const extra = {
	apiKey: 'AIzaSyCWez1Vckm87Za7j-SzaiMEXhs-FZjeNvo'
};
// Geo-coder
const geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

// Location GeoCoder Middleware -- Adds coords to new event
module.exports = exports = (req, res, next) => {
	
	if(req.body.source === 'events12') {
		return next();
	}
	// Check for location	
	if (!req.body.location.address) {
		return e.missingProp(res, 'An address');
	}

	// Get Coords
	geocoder.geocode(req.body.location.address, function(err, res) {
		// Get res
		var geo = res[0];
		// Store venue
		var venue = req.body.location.venue;
		// Create location info
		req.body.location = {
			area: geo.extra.neighborhood,
			address: geo.formattedAddress,
			venue: venue,
			coords: {
				latitude: geo.latitude,
				longitude: geo.longitude
			}
		}

		next();
	});
}