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

router.post('/send', (req, res, next) => {

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

	// parse the incoming request containing the form data
    form.parse(req, (err, fields, files) => {

    	if (err) return next(err);

    	// get uploads array either is a single file
    	let uploads = (Array.isArray(files.uploads)) ?
    		files.uploads :
    		new Array(files.uploads);

		// process every document attached, with request fields
		let uploadsP = uploads.map((file) => {

			return processDocumentInEntry(file, fields);

		});

		Promise.all(uploadsP)
			.then(() => {
				res.end('file uploaded successfully');
			})
			.catch(err => {
				removeTmp()
					.then(() => {
						if (typeof err === 'string') {
							err = new Error('Error in upload controller: \n' + err);
						}
						next(err);
					});
			});

    });

	function processDocumentInEntry(file, data) {

		return new Promise((resolve, reject) => {

			checkType(file)
				.then(setFileData.bind(this, data))
				.then(handleFile.bind(this, file))
				.then(removeTmp)
				.then(resolve)
				.catch(reject);

		})

	}

	// check file data type if is pdf
    function checkType(file) {

    	return (file.type === "application/pdf") ?

			Promise.resolve() :

    		Promise.reject(new Error('only pdf are allowed for upload'));

    }

    // passing form data to Document model
	function setFileData(data) {

		return new Promise((resolve, reject) => {

			let desc = data.description || 'This document has no description';

			delete data.description;
			data.desc = desc;
			data.actualDate = new Date().toString();

			Document.create(data, (err, result) => {

				if (err) reject(err);

				resolve(result.key);

			});

		})

	}

	// rename file with unique key value received and place it in the uploads folder
	function handleFile(file, name) {

		return new Promise((resolve, reject) => {

			let destFolder = path.join(form.uploadDir, '../');
			let destFilePath = path.join( destFolder, name + '.pdf' );
			fs.rename(file.path, destFilePath, err => {

				if (err) reject(err);

				resolve(destFolder);

			});

		});

	}

	// remove tmp directory and all temporary files
	function removeTmp(targetPath) {

		return new Promise(resolve => {
			let tmp = (targetPath) ?
				path.normalize(targetPath  + '/tmp') :
				path.join(__dirname, '../uploads/tmp');

			if (fs.existsSync(tmp)) {
				fs.readdir(tmp, (err, files) => {
					files.forEach(file => {
						fs.unlinkSync(path.join(tmp, file));
					});
					fs.rmdirSync(tmp);
					resolve();
				})
			}
			resolve();
		});

	}

	// log any errors that occur
	form.on('error', (err) => {
		removeTmp()
			.then(() => {
				if (typeof err === 'string') {
					err = new Error('An error has occured: \n' + err);
				}
				next(err);
			});
	});

});

module.exports = router;