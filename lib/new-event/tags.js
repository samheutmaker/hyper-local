module.exports = exports = (req, res, next) => {
	// Create Tags
	req.body.tags = (req.body.tags) ? req.body.tags : [];
	// Add Tags
	req.body.description.split(" ").forEach((
		item, itemIndex) => {
		if (item.length > 2) {
			req.body.tags.push(item.toLowerCase());
		}
	});
	// Tags to remove
	const toRemove = [
		'and',
		'about',
		'above',
		'across',
		'after',
		'against',
		'along',
		'amid',
		'among',
		'anti',
		'around',
		'as',
		'at',
		'before',
		'behind',
		'below',
		'beneath',
		'beside',
		'besides',
		'between',
		'beyond',
		'but',
		'by',
		'concerning',
		'considering',
		'despite',
		'down',
		'during',
		'except',
		'excepting',
		'excluding',
		'following',
		'for',
		'from',
		'in',
		'inside',
		'into',
		'like',
		'minus',
		'near',
		'of',
		'off',
		'on',
		'onto',
		'opposite',
		'outside',
		'over',
		'past',
		'per',
		'plus',
		'regarding',
		'round',
		'save',
		'since',
		'than',
		'through',
		'to',
		'toward',
		'towards',
		'under',
		'underneath',
		'unlike',
		'until',
		'up',
		'upon',
		'versus',
		'via',
		'with',
		'within',
		'without'
	];


	console.log(req.body.tags);

	req.body.tags.forEach(function(tag, index) {
		toRemove.forEach(function(remove, rmIndex) {
			if(tag === remove) {
				req.body.tags.splice(index,1);
			}
		})
	});


	next();
}