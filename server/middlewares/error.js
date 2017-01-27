module.exports = function(err, req, res, next) {

	console.error(err);

	res.status(500);

	res.end(err.message || 'Internal server error');

}