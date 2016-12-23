// common global variables added to every view
const path = require('path');

module.exports = function(req, res, next) {

	//view name
    res.locals.staticBasePath = req.path.split('/')[1] || 'home';
    next();

};