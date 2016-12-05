const
	express = require('express'),
	router = express.Router(),
	path = require('path'),
	formidable = require('formidable'),
	fs = require('fs');

router.get('/', (req, res) => {
	res.render('pages/upload');
})

router.get('/send', (req, res) => {

	// create an incoming form object
	var form = new formidable.IncomingForm();

	// specify that we want to allow the user to upload multiple files in a single request
	form.multiples = true;

	// store all uploads in the /uploads directory
	form.uploadDir = path.join(__dirname, '/uploads');

	// every time a file has been uploaded successfully,
	// rename it to a unique key a store upload information in redis
	form.on('file', (field, file) => {
		fs.rename(file.path, path.join(form.uploadDir, file.name));
	});

	// log any errors that occur
	form.on('error', (err) => {
		console.log('An error has occured: \n' + err);
	});

	// once all the files have been uploaded, send a response to the client
	form.on('end', () => {
		res.end('success');
	});

	// parse the incoming request containing the form data
	form.parse(req);

});

module.exports = router;