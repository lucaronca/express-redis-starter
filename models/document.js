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

		client.lpush( 'document:keys', key, ( err, resp ) => {

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

	client.lrange('document:keys', 0, -1, function(err, documents){

		if (err) return cb(err);

		if (!documents || (Array.isArray(documents) && !documents.length)) {

			err = new Error('Empty list');

			return cb(err);

		}

		let actions = documents.map(getDocData);

		let results = Promise.all(actions);

		results
			.then((data) => cb(null, data))
			.catch((err) => cb(err));


	});

}

function getDocData(key) {

	return new Promise((resolve, reject) => {

		client.get( key, ( err, resp ) => {

			if (err) reject(err);

			resolve(JSON.parse(resp));

		});

	});

}

exports.getDocData = getDocData;