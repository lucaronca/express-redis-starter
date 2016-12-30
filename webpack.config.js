const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');

const PATHS = {
    scripts: {
        home: path.join(__dirname, 'public', 'app', 'home'),
        upload: path.join(__dirname, 'public', 'app', 'upload')
    },
    styles: {
        home:  path.join(__dirname, 'public', 'app', 'home', 'styles.scss'),
        upload: path.join(__dirname, 'public', 'app', 'upload', 'styles.scss'),
        commons: path.join(__dirname, 'public', 'app', 'commons', 'styles.scss')
    },
    vendor: ['jquery', 'foundation-sites'],
    build: path.join(__dirname, 'public', 'build')
};

const common = {
    entry: {
        home: [PATHS.scripts.home, PATHS.styles.home],
        upload: [PATHS.scripts.upload, PATHS.styles.upload],
        // app's common shared parts, for the moment just styles
        commons: PATHS.styles.commons
    },
    output: {
        path: PATHS.build,
    },
    stats: {
        // Nice colored output
        colors: true
    }
};

module.exports = function(env) {
    if (env === 'production') {
        return merge(
            common,
            {
                devtool: 'source-map',
                output: {
                    // This is used for code splitting. The setup
                    // will work without but this is useful to set.
                    chunkFilename: '[chunkhash].js',
                    publicPath: '/public/',
                    // Production file name
                    filename: '[name].[chunkhash].js'
                }
            },
            parts.clean(PATHS.build),
            parts.setFreeVariable(
                'process.env.NODE_ENV',
                'production'
            ),
            parts.extractBundle({
                entries: PATHS.vendor,
                name: 'vendor'
            }),
            parts.setupStyles(),
            parts.setupScripts()
            //parts.minify()
            //parts.extractCSS(PATHS.style),
            //parts.purifyCSS([PATHS.app])
        );
    }

    return merge(
        common,
        {
            devtool: 'eval-source-map',
            // Disable performance hints during development
            performance: {
                hints: false
            }
        },
        parts.setupCSS(PATHS.style),
        parts.devServer({
            // Customize host/port here if needed
            host: process.env.HOST,
            port: process.env.PORT
        })
    );
};