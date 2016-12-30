const
	client = require('../db.js'),
	KeyGenerator = require('../helpers/KeyGenerator');

let gen = new KeyGenerator(12);


// Create new document in database and return its id
exports.create = (data, cb) => {

	let key = gen.create();

	function storeDocData() {

		client.set( key, JSON.stringify(data), ( err ) => {

			if (err) return Promise.reject(err);

			return Promise.resolve();

		});

	}

	function setYear() {

		client.lpush( data.year, key, ( err ) => {

			if (err) return Promise.reject(err);

			return Promise.resolve();

		});

	}

	function setMonth() {

		client.lpush( data.month, key, ( err ) => {

			if (err) return Promise.reject(err);

			return Promise.resolve();

		});

	}

	function pushKeysList() {

		client.lpush( 'document:keys', key, ( err ) => {

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

};

// Get a particular comment
exports.get = function(id, cb) {
  cb(null, {id:id, text: 'Very nice example'})
};

// Get all documents
exports.all = function(cb) {

	client.lrange('document:keys', 0, -1, function(err, keys){

		if (err) return cb(err);

		/*if (!documents || (Array.isArray(documents) && !documents.length)) {

			err = new Error('Empty list');

			return cb(err);

		}*/

		let actions = keys.map(getDocData);

		let results = Promise.all(actions);

		results
			.then((data) => cb(null, data))
			.catch((err) => cb(err));


	});

};

function getDocData(key) {

	return new Promise((resolve, reject) => {

		client.get( key, ( err, resp ) => {

			if (err) reject(err);

			resp = JSON.parse(resp);

			resp.key = key;

			resolve(resp);

		});

	});

}

exports.getDocData = getDocData;