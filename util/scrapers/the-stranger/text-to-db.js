const fs = require('fs');
const http = require('http');
const staff = require('staff');
const xray = require('x-ray')();

var allContent = JSON.parse(fs.readFileSync('event-html.json', 'utf8'));

allContent.length = 2500;

var noUnixDate = [];

staff.waitAndFire(0, allContent.length, function(x) {

	if (allContent[x]) {
		xray(allContent[x], '', {
			name: '.event-name @text',
			date: '.event-date @text',
			description: '#event-description @text',
			cost: '.event-ticket-price @text',
			linkToMoreInfo: '#event-url a @href',
			linkToTicketInfo: '.event-ticket-link a @href',
			phone: '.venue-phone @text',
			tags: ['.event-category a @text'],
			location: {
				venue: '.venue-name @text',
				address: '.venue-address @text'
			}
		})(function(err, newContent) {
			console.log(x);
			
			newContent.unixDate = Date.parse(newContent.date +  ' 2016');
		

			// console.log(newContent.unixDate);
			newContent.source = 'the-stranger'

			var options = {
				hostname: '',
				port: '8888',
				path: '/api/events/create',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'User-Agent': 'request',
					'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU2Yjk4NDE3NGQ2YzE0ZjYyNDc1MzBlNSIsImlhdCI6MTQ1NDk5OTg5Mn0.NAhUaMKzhrNuBrAVFwhsEaeorLCzG5Y4BmDcbUw-eQU'
				}
			};

			var callback = function(response) {

			}

			var req = http.request(options, callback);
			//This is the data we are posting, it needs to be a string or a buffer
			req.write(JSON.stringify(newContent));
			req.end();



		});
	}

	if (x === allContent.length - 1) {
		fs.writeFileSync('date-format.json', JSON.stringify(noUnixDate));
	}
});