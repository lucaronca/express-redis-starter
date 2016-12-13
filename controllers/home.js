const
	express = require('express'),
	router = express.Router(),
	Document = require('../models/document');

router.get('/', (req, res, next) => {

	Document.all((err, data) => {

		if (err) return next(err);

	});

	res.render('pages/home');
})

module.exports = router;