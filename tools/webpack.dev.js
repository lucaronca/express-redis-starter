'use strict';

const
    path = require('path'),
    webpack = require('webpack'),
    config = require('./../config'),
    common = require('./webpack.common');

let devConfig = {

    cache: true,

    entry: common.getEntries('development'),

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
        path: '/',
        publicPath: 'http://localhost:' + config.port + '/development/',
        filename: '[name].bundle.js'
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]

};

module.exports = devConfig;