const
	express = require('express'),
	router = express.Router(),
	Document = require('../data/models/document');

router.get('/', (req, res, next) => {

	Document.all((err, data) => {

		if (err) return next(err);

		// change documents display order
		let reverse = (req.query.reverse === 'true') ;

		if (reverse) data.reverse();

		res.render('pages/home', { data, reversed: reverse });

	});
	
});

module.exports = router;