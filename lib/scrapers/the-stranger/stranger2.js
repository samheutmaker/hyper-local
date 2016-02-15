const fs = require('fs');

var filepath = __dirname + '/the-stranger.json';
var allLinks = JSON.parse(fs.readFileSync(filepath, 'utf8'));



var cleaned = removeDuplicates(allLinks);

cleaned.forEach(function(cleaned, index){
	console.log(index);
});

function removeDuplicates(array) {

	var length = array.length;
	var toReturn = [];
	var helper = {};

	array.forEach(function(link, index){
		helper[link] = 0;
	});

	for(var i in helper) {
		toReturn.push(i);
	}

	return toReturn;
}