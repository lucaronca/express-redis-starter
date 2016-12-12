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

	function storeDocData() {

		client.set( key, JSON.stringify(data), ( err, resp ) => {

			if (err) return Promise.reject(err);

			return Promise.resolve();

		});

	}

	function setYear() {

		client.lpush( data.year, key, ( err, resp ) => {

			if (err) return Promise.reject(err);

			return Promise.resolve();

		});

	}

	function setMonth() {

		client.lpush( data.month, key, ( err, resp ) => {

			if (err) return Promise.reject(err);

			return Promise.resolve();

		});

	}

	function pushKeysList() {

		client.lpush( 'keys', key, ( err, resp ) => {

			if (err) return Promise.reject(err);

			return Promise.resolve();

		});

	}

	Promise.all([storeDocData(),
				setYear(),
				setMonth(),
				pushKeysList()])
		.then( () => {

			cb(null, { key })

		})
		.catch( err => {

			cb(err);

		});

}

// Get a particular comment
exports.get = function(id, cb) {
  cb(null, {id:id, text: 'Very nice example'})
}

// Get all documents
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