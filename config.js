const path = require('path');

exports.webpack_paths = {

    src: path.join(__dirname, '..', 'client', 'src'),
    build: path.join(__dirname, '..', 'public', 'build')

};

exports.port = process.env.PORT || 5000;

exports.host = process.env.WEBSITE_HOSTNAME || `localhost:${exports.port}`;