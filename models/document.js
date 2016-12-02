const
	client = require('../db.js'),
	KeyGenerator = require('../helpers/keyGenerator');

let generator = new KeyGenerator(16);


// Create new document in your database and return its id
exports.create = function(id, title, content, date, cb) {

	//@TODO check if content is buffer, create id

	let dataInfo = {
		title,
		date: {
			month: date.month,
			yeat: date.year
		},
		actualDate: new Date().toString()
	};

	// My object will be an array with a random key, content is the first value, object data the second

	var key = generateKey();

	client.lpush(key, content);

	client.lpush(key, JSON.stringify(dataInfo));

}

// Get a particular comment
exports.get = function(id, cb) {
  cb(null, {id:id, text: 'Very nice example'})
}

// Get all comments
exports.all = function(cb) {

	client.lrange('documents', 0, -1, function(err, documents){

		errorHandler(err);

		cb(null, documents);

	});

}

function errorHandler(err) {

	if (err) {
		console.error('error in create model');
		throw new Error(err);
	}

}

// Get all comments by a particular user
exports.allByUser = function(user, cb) {
  cb(null, [])
}