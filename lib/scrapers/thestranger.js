module.exports = exports = function() {

  const Xray = require('x-ray');
  const xray = Xray();
  const SOURCE = 'thestranger';
  const majorA = require('major-a');
  const mAnalytics = majorA.majorAnalytics;
  const Event = require(__dirname + '/../../models/event');



  var months = [{
    name: 'february',
    length: 28,
    monthNumber: '02'
  }, {
    name: 'march',
    length: 31,
    monthNumber: '03'
  }, {
    name: 'april',
    length: 30,
    monthNumber: '04'
  }, {
    name: 'may',
    length: 31,
    monthNumber: '05'
  }, {
    name: 'june',
    length: 30,
    monthNumber: '06'
  }, {
    name: 'july',
    length: 31,
    monthNumber: '07'
  }, {
    name: 'august',
    length: 30,
    monthNumber: '08'
  }];


  var baseUrl = 'http://thestranger.com/events//2016-';

  var workQueue = [];
  months.forEach(function(month, index) {
    for (var day = 1; day < month.length; day++) {

      var twoDigits = (day > 9) ? '' : '0';

      var stringToScrape = baseUrl + month.monthNumber + '-' +
        twoDigits + day;

      // The funcion that will added to the work queue

      // End of function declaration
      workQueue.push(stringToScrape);
    }
  });

  console.log('======== STARTING=========')
  console.log('======== STARTING=========')
  console.log('======== STARTING=========')
  console.log('======== STARTING=========')
  console.log('======== STARTING=========')
  console.log('======== STARTING=========')

  function inside(min, max, callback) {
    if (min < max) {
      setTimeout(function() {
        callback(min);
        inside(++min, max, callback);
      }, 2000);
    }
  }

  inside(0, workQueue.length, function(x) {
    console.log(workQueue[x]);
    xray(workQueue[x], '.calendar-post', [{
      date: '.calendar-post-date @text',
      name: '.calendar-post-title a @text',
      tag: '.calendar-category @text',
      venue: '.calendar-post-venue',
      area: '.calendar-post-neighborhood',
      price: '.calendar-post-event-price',
      source: SOURCE
    }])((err, content) => {

      if (content.length) {
        content.forEach(function(event, eventIndex) {
          // Remove new lines
          event.name = event.name.replace(/\n/g, '');
          event.date = event.date.replace(/\n/g, '');
          // Remove whitespace at beginning
          while (event.date.charAt(0) === ' ') {
            event.date = event.date.substr(1);
          }
          while (event.name.charAt(0) === ' ') {
            event.name = event.name.substr(1);
          }

          if (event.date.indexOf('Start') > 0) {
            console.log('Skipped');

          } else {
            event.unixDate = Date.parse(event.date);

            if (event.unixDate !== NaN) {

              var shouldAdd = true;
              shouldAdd = Event.findOne({
                name: event.name,
                unixDate: event.unixDate
              });
              if (shouldAdd === undefined) {
                var toSave = new Event();
                toSave.name = event.name;
                toSave.unixDate = event.unixDate;
                tosSave.cost = event.price;
                toSave.location.venue = event.venue;
                toSave.location.area = event.area;
                toSave.active = true;
                toSave.postedOn = new Date();
                toSave.save((err, data) => {
                  if (err) {
                    return console.log(
                      'There was an error saving')
                  }
                  if (!data) {
                    return console.log('No Data Saved')
                  }

                  console.log('Saved');
                })
              }
            }
          }
        })
      } else {
        console.log('Content is empty');
      }
    })
  });

}
