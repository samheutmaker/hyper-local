module.exports = exports = {
	dbFindError: function(err, res) {
		res.status(500).json({
			msg: 'There was an error.',
			code: 1
		});
	},
	dbSaveError: function(err, res) {
		res.status(500).json({
			msg: 'There was an error.',
			code: 2
		});
	},
	noContent: function(res){
		res.status(500).json({
			msg: 'No content.'
		});
	}
}
