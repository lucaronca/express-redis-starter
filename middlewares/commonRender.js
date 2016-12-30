/* common global variables added to every view */

const path = require('path');
const Assets = require('../helpers/Assets');

module.exports = function(req, res, next) {

	//view name
    let viewName = req.path.split('/')[1] || 'home';

    // Get assets file names and store they in a specific object passed in view
    // See Asset helper
    let assets = new Assets(req, viewName);
    assets.filter()
        .then((results) => {
            res.locals.assets = results;
            next();
        });
};