'use strict';

const
    path = require('path'),
    webpack = require('webpack'),
    PATHS = require('./../config').webpack_paths,
    port = require('./../config').port;

let config = {

    cache: true,

    // each value on this object MUST have the extra modules
    entry: {
        vendor: ['jquery', 'foundation-sites', 'webpack-hot-middleware/client', 'webpack/hot/dev-server'],
        home: [path.join(PATHS.src, './home/index.js'), path.join(PATHS.src, './home/styles.scss'), 'webpack-hot-middleware/client', 'webpack/hot/dev-server'],
        upload: [path.join(PATHS.src, './upload/index.js'), path.join(PATHS.src, './upload/styles.scss'), 'webpack-hot-middleware/client', 'webpack/hot/dev-server'],
        login: [path.join(PATHS.src, './login/index.js'), path.join(PATHS.src, './login/styles.scss'), 'webpack-hot-middleware/client', 'webpack/hot/dev-server'],
        common: [path.join(PATHS.src, './commons/styles.scss'), 'webpack-hot-middleware/client', 'webpack/hot/dev-server']
    },

    // this is a default value; just be aware of it
    target: 'web',
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader?sourceMap',
                    'css-loader?sourceMap',
                    'resolve-url-loader',
                    'sass-loader?sourceMap'
                ]
            },
            {
                test: /\.woff(2)?$/,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            }
        ]
    },
    // 'publicPath' is where the hosted app expects the resources
    output: {
        path: PATHS.build,
        publicPath: 'http://localhost:' + port + '/development/',
        filename: '[name].bundle.js'
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]

};

module.exports = config;