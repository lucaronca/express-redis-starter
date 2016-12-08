const
	express = require('express'),
	router = express.Router(),
	path = require('path'),
	formidable = require('formidable'),
	fs = require('fs'),
	Document = require('../models/document');

router.get('/', (req, res) => {
	res.render('pages/upload');
})

router.post('/send', (req, res) => {

	// create an incoming form object
	var form = new formidable.IncomingForm();

	// specify that we want to allow the user to upload multiple files in a single request
	form.multiples = true;

	// create temporary directory to store uploaded file
	let tmp = path.join(__dirname, '../uploads/tmp');

	if (!fs.existsSync(tmp)) {
		fs.mkdirSync(tmp);
	}

	// store all uploads in the /uploads/tmp directory
	form.uploadDir = tmp;

	// every time a file has been uploaded successfully,
	// rename it to a unique key a store upload information in redis
	form.on('file', (field, file) => {

		handleFileData(file)
			.then(setFile.bind(null, file))
			.then(removeTmp)
			.catch(reason => {
				console.error('Error in upload controller: ', reason);
			});

	});

	function handleFileData(file) {

		return new Promise((resolve, reject) => {

			Document.create('test', { month: 'December', year: 2016 }, (err, data) => {

				if (err) reject(new Error(err));

				resolve(data.key);

			});

		})

	}

	function setFile(file, name) {

		return new Promise((resolve, reject) => {

			// rename file with unique key value and place it in the uploads folder
			let destFolder = path.join(form.uploadDir, '../');
			let destFilePath = path.join( destFolder, name + '.pdf' );
			fs.rename(file.path, destFilePath, err => {

				if (err) reject(new Error(err));

				resolve(destFolder);

			});

		});

	}

	function removeTmp(targetPath) {

		targetPath = path.normalize(targetPath  + '/tmp');
		fs.rmdirSync(targetPath);

	}

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