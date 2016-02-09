module.exports = exports = function() {

const Xray = require('x-ray');
const xray = Xray();
const SOURCE = 'thestranger';
const majorA = require('major-a');
const mAnalytics = majorA.majorAnalytics;
const Event = require(__dirname + '/../../models/event');





  const Xray = Meteor.npmRequire('x-ray');
  const stall = Meteor.npmRequire('stall');

  var sleep = stall(function(timeout, done) {
    //just make sure to call done() to yield back the event loop
    setTimeout(done, timeout)
  })

  var xray = new Xray();

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

  months.forEach(function(month, index) {
    for (let day = 1; day < month.length; day++) {

      let twoDigits = (day > 9) ? '' : '0';

      let stringToScrape = baseUrl + month.monthNumber + '-' +
        twoDigits + day;
      // console.log(stringToScrape);

      sleep(2000);

      xray(stringToScrape, '.calendar-post', [{
        date: '.calendar-post-date @text',
        name: '.calendar-post-title a @text',
        tag: '.calendar-category @text',
        venue: '.calendar-post-venue',
        area: '.calendar-post-neighborhood',
        price: '.calendar-post-event-price',
        source: SOURCE
      }])(Meteor.bindEnvironment(function(err, content) {

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
              shouldAdd = Events.findOne({
                name: event.name,
                unixDate: event.unixDate
              });
              if (shouldAdd === undefined) {
                Events.insert(event);
                console.log('Added');
              }
            }
          }
        })
      }));

    }
  });

}
