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
      for (var i = 1; i < 12; i++) {
        var newString = stringToScrape + '?page=' + i + '&view_id=events';
        console.log(newString);
        workQueue.push(newString);
      }

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
      }, 1000);
    }
  }

  var allLinksToScrape = [];

  inside(0, workQueue.length, function(x) {
    xray(workQueue[x], '.calendar-post', [{
      link: '.calendar-post-title a @href'
    }])((err, content) => {


      if (content.length) {
        content.forEach(function(event, eventIndex) {
          allLinksToScrape.push(event.link);
          console.log(event.link);
        })
      } else {
        console.log('Content Empty');
      }
    })

    if (x == workQueue.length - 1) {
      allLinksToScrape.forEach((link, linkIndex) => {
        console.log(link);
      })
      console.log(allLinksToScrape.length);
    }
  });



}
