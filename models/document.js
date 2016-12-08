const
	client = require('../db.js'),
	KeyGenerator = require('../helpers/keys');

let gen = new KeyGenerator(12);


// Create new document in database and return its id
exports.create = (title, date, cb) => {

	//@TODO check if content is buffer, create id

	let data = {
		title,
		month: date.month,
		year: date.year,
		actualDate: new Date().toString()
	};

	let key = gen.create();

	client.hmset( key, data, ( err, resp ) => {

		if (err) {
			return cb(err);
		}

		cb( null, { status: resp, key } );

	});

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