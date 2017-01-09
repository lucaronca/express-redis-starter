'use strict';

const path = require('path'),
    webpack = require('webpack'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    WebpackMd5Hash = require('webpack-md5-hash'),
    ManifestPlugin = require('webpack-manifest-plugin'),
    ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');

const PATHS = {
    app: path.join(__dirname, 'public', 'app'),
    build: path.join(__dirname, 'public', 'build')
};

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
        $: path.join(__dirname, 'node_modules', 'jquery/dist/jquery'),
        jQuery: path.join(__dirname, 'node_modules', 'jquery/dist/jquery')
    }),
    new ExtractTextPlugin({
        filename: '[name].styles.[chunkhash].css',
        allChunks: true
    }),
    new CleanWebpackPlugin([PATHS.build], {
        // Without `root` CleanWebpackPlugin won't point to our
        // project and will fail to work.
        root: process.cwd()
    })
];

let common = {
    entry: {
        vendor: ['jquery', 'foundation-sites'],
        home: [path.join(PATHS.app, './home/index.js'), path.join(PATHS.app, './home/styles.scss')],
        upload: [path.join(PATHS.app, './upload/index.js'), path.join(PATHS.app, './upload/styles.scss')],
        common: path.join(PATHS.app, './commons/styles.scss')
    },
    output: {
        path: PATHS.build,
        filename: '[name].bundle.[chunkhash].js',
        chunkFilename: '[name].chunk.[chunkhash].js'
    },
    module: {
        noParse: /node_modules\/foundation-sites/,
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: [
                        'css-loader?sourceMap',
                        'resolve-url-loader',
                        'sass-loader?sourceMap'
                    ]
                })
            },
            {
                test: /\.otf$|\.eot$|\.svg$|\.ttf$/,
                loader: 'file-loader'
            },
            {
                test: /\.woff(2)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    type: 'application/font-woff'
                }
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
