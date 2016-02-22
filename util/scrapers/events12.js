module.exports = exports = function() {
  // Xray
  const Xray = require('x-ray');
  const xray = Xray();
  const http = require('http');
  const staff = require('staff');

  // Source
  const SOURCE = 'events12';
  // Scraping set up
  const months = ['january', 'february', 'march', 'april', 'may',
    'june', 'july', 'august', 'september', 'october'
  ];

  staff.waitAndFire(0,months.length, function(i) {

    var stringToScrape = 'http://www.events12.com/seattle/' + months[i] +
      '/';

    xray(stringToScrape, '.event', [{
      title: '.title',
      date: '.date',
      link: 'a @href',
      allContent: '@text'
    }])(function(err, content) {
      content.forEach(function(el, i) {
        // Get from content
        var newEvent = {
          name: el.title,
          date: el.date,
          linkToMoreInfo: el.link,
          description: el.allContent,
          source: SOURCE,
        };

        // Parse events with multiple dates
        if (newEvent.date.indexOf('-') > 0) {

          newEvent.firstDate = newEvent.date.split(' -');

          newEvent.firstDate = newEvent.firstDate[0] +
            ', 2016';

          newEvent.unixDate = Date.parse(newEvent.firstDate);

        } else {
          newEvent.unixDate = Date.parse(newEvent.date);
        }


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
        req.write(JSON.stringify(newEvent));
        req.end();



      });
    });
  });

}