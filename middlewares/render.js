const path = require('path');

module.exports = function(req, res, next) {

    res.locals.staticBasePath = path.join(path.dirname(require.main.filename), '/public');
    next();

};