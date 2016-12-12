const
	express = require('express'),
	router = express.Router(),
	Document = require('../models/document');

router.get('/', (req, res) => {

	Document.all((err, data) => {

		console.log(err);
		console.log(data);

	});

	res.render('pages/home');
})

module.exports = router;