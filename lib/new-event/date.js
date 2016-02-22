// Errors
const e = require(__dirname + '/../errors/errors');

module.exports = exports = function(req, res, next) {
	if(req.body.unixDate && new Date(req.body.unixDate) !== null) {
		next();
	}
}