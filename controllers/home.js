const
	express = require('express'),
	router = express.Router(),
	Document = require('../models/document');

router.get('/', (req, res, next) => {

	Document.all((err, data) => {

		if (err) return next(err);

		// change documets display order
		let reverse = (req.query.reverse === 'true') ;

		if (reverse) data.reverse();

		res.render('pages/home', { data, webpackbundle: 'home', reversed: reverse });

	});

	
})

module.exports = router;