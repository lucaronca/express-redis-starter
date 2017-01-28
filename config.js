const path = require('path');

exports.webpack_paths = {

    src: path.join(__dirname, 'client', 'src'),
    build: path.join(__dirname, 'client', 'build')
};

exports.webpack_entries = {
    vendor: ['jquery', 'foundation-sites'],
    home: ['index.js', 'styles.scss'],
    login: ['index.js', 'styles.scss'],
    upload: ['index.js', 'styles.scss'],
    common: ['styles.scss']
};

exports.env = process.env.NODE_ENV || 'production';

exports.port = process.env.PORT || 5000;

exports.host = process.env.WEBSITE_HOSTNAME || `localhost:${exports.port}`;
