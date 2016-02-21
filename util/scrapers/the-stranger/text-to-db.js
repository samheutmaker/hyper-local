const fs = require('fs');
const xray = require('x-ray')();

var allContent = JSON.parse(fs.readFileSync('event-html.json', 'utf8'));


var html = "<body><h2>Pear</h2></body>";
xray(html, 'body', 'h2')(function(err, header) {
	console.log(header);
})

allContent.forEach(function(content, index) {
	if (content) {
		xray(content, '', {
			title: '.event-name @text',
			date: '.event-date @text',
			linkToMoreInfo: '.event-ticket-link a @href',
			description: '#event-description @text',
			location: {
				venue: '.venue-name @text',
				address: '.venue-address @text'
			}
		})(function(err, newContent) {
			console.log(newContent);
		});
	}
});