'use strict';

const path = require('path'),
    webpack = require('webpack'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    WebpackMd5Hash = require('webpack-md5-hash'),
    ManifestPlugin = require('webpack-manifest-plugin'),
    ChunkManifestPlugin = require('chunk-manifest-webpack-plugin'),
    CONFIG = require('./../config');

let plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: 2
    }),
    new WebpackMd5Hash(),
    /* generating an asset manifest. */
    new ManifestPlugin(),
    /* extracting manifest json file */
    new ChunkManifestPlugin({
        filename: 'chunk-manifest.json',
        manifestVariable: 'webpackManifest'
    }),
    new webpack.ProvidePlugin({
        $: path.join(__dirname, '..', 'node_modules', 'jquery/dist/jquery'),
        jQuery: path.join(__dirname, '..', 'node_modules', 'jquery/dist/jquery')
    }),
    new CleanWebpackPlugin([CONFIG.webpack_paths.build], {
        // Without `root` CleanWebpackPlugin won't point to our
        // project and will fail to work.
        root: process.cwd()
    })
];

let common = {
    module: {
        noParse: /node_modules\/foundation-sites/,
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015']
                        }
                    }
                ]
            },
            {
                test: /\.otf$|\.eot$|\.svg$|\.ttf$/,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            }
        ]
    },
    plugins: plugins,
    devtool: 'source-map',
    stats: {
        // Nice colored output
        colors: true
    }
};

module.exports = common;
