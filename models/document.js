const client = require('../db.js');

// Create new document in your database and return its id
exports.create = function(id, content, date, cb) {

	let document = {
		id,
		content,
		date: {
			month: date.month,
			yeat: date.year
		},
		actualDate: new Date().ToString()
	}

	client.set('document', document);

}

// Get a particular comment
exports.get = function(id, cb) {
  cb(null, {id:id, text: 'Very nice example'})
}

// Get all comments
exports.all = function(cb) {
  cb(null, [])
}

// Get all comments by a particular user
exports.allByUser = function(user, cb) {
  cb(null, [])
}