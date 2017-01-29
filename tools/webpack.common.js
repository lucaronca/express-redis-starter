'use strict';

const path = require('path'),
    fs = require('fs'),
    webpack = require('webpack'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    WebpackMd5Hash = require('webpack-md5-hash'),
    ManifestPlugin = require('webpack-manifest-plugin'),
    ChunkManifestPlugin = require('chunk-manifest-webpack-plugin'),
    appConfig = require('../config');

let plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name: 'shared',
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
    new CleanWebpackPlugin([appConfig.webpack_paths.build], {
        // Without `root` CleanWebpackPlugin won't point to our
        // project and will fail to work.
        root: process.cwd()
    })
];

let config = {
    entry: getEntries.bind(appConfig, appConfig.env),
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

function getEntries(env) {
    let res = {};
    for( let entry in this.webpack_entries) {
        if(this.webpack_entries.hasOwnProperty(entry)) {
            res[entry] = this.webpack_entries[entry].map(asset => {
                if (asset === 'index.js' || asset === 'styles.scss')
                    return path.join(this.webpack_paths.src, entry, asset);
                // is a module name
                return asset;
            });
            if (env === 'development')
                res[entry].push('webpack-hot-middleware/client', 'webpack/hot/dev-server');
        }
    }
    return res;
};
exports.config = config;
exports.getEntries = getEntries.bind(appConfig);
