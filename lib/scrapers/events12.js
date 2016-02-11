module.exports = exports = function() {
  // Xray
  const Xray = require('x-ray');
  const xray = Xray();

  // Resource tracking
  const majorA = require('major-a');
  const mAnalytics = majorA.majorAnalytics;
  const Event = require(__dirname + '/../../models/event');

  // Source
  const SOURCE = 'events12';
  // Scraping set up
  const months = ['january', 'february', 'march', 'april', 'may',
    'june'
  ];

  months.forEach(function(month, index) {

    var stringToScrape = 'http://www.events12.com/seattle/' + month +
      '/';

    xray(stringToScrape, '.event', [{
      title: '.title',
      date: '.date',
      link: 'a @href',
      allContent: '@html'
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

        var tags = [];
        newEvent.description.split(" ").forEach((
          item, itemIndex) => {
          if (item.length > 2) {
            tags.push(item.toLowerCase());
          }
        });

        // Try to find event with matching properties to avoid duplicates
        Event.findOne({
          name: newEvent.name,
          unixDate: newEvent.unixDate
        }, (err, data) => {
          //Check for error
          if (err) return 'There was an error';
          // If no match event found
          if (!data) {
            var eventToInsert = new Event();
            //Assign properies
            eventToInsert.name = newEvent.name;
            eventToInsert.linkToMoreInfo = newEvent.linkToMoreInfo;
            eventToInsert.unixDate = newEvent.unixDate;
            eventToInsert.date = newEvent.date;
            eventToInsert.description = newEvent.description;
            eventToInsert.tags = tags;
            eventToInsert.active = true;
            eventToInsert.source = SOURCE;
            eventToInsert.save((err, event) => {
              if (err) return console.log(
                'There was an error');
              if (!event) return console.log('No Event');

              //Track insert
              mAnalytics.createTracker(event._id, 'event');
              console.log(i + '/' + content.length +
                ' for month ' + month + ' INSERTED.');
            })
          } else {
            console.log(i + '/' + content.length +
              ' for month ' + month + ' SKIPPED.');
            return console.log(newEvent.name);
          }
        });
      });
    });
  });

}
