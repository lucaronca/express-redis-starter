const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');

const PATHS = {
    build: path.join(__dirname, 'public', 'build')
};

const common = {
    entry: {
        home: path.join(__dirname, 'public', 'app', 'home'),
        upload: path.join(__dirname, 'public', 'app', 'upload')
    },
    output: {
        path: PATHS.build,
        filename: '[name].build.js'
    },
    stats: {
        // Nice colored output
        colors: true
    }
};

module.exports = function(env) {
    if (env === 'build') {
        return merge(
            common,
            {
                devtool: 'source-map',
                output: {
                    path: PATHS.build,
                    // This is used for code splitting. The setup
                    // will work without but this is useful to set.
                    chunkFilename: '[chunkhash].js',
                    publicPath: '/public/'
                }
            },
            parts.clean(PATHS.build),
            parts.setFreeVariable(
                'process.env.NODE_ENV',
                'production'
            ),
            parts.extractBundle({
                name: 'commons'
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