const fs = require('fs');
const mongoose = require('mongoose');
const staff = require('staff');

// DB String
const dbString = process.env.MONGO_URI || 'mongodb://samheutmaker:kingpin13@apollo.modulusmongo.net:27017/yvuxe4vU';

// Connect to DB
mongoose.connect(dbString);


var filepath = __dirname + '/events.json';
var allLinks = JSON.parse(fs.readFileSync(filepath, 'utf8'));


const Xray = require('x-ray');
const xray = Xray();

// Resource tracking
const majorA = require('major-a');
const mAnalytics = majorA.majorAnalytics;
const Event = require(__dirname + '/../../../models/event');


var contentHolder = [];


staff.waitAndFire(0, allLinks.length, function(index) {
  xray(allLinks[index], '#event-main @html')(function(err, content) {
  	contentHolder.push(content);
    console.log(content);

    if(index === allLinks.length - 1) {
    	fs.writeFileSync('event-html.json', JSON.stringify(contentHolder));
    }
  });
});