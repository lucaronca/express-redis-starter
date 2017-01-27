'use strict';

const path = require('path'),
    fs = require('fs'),
    webpack = require('webpack'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    WebpackMd5Hash = require('webpack-md5-hash'),
    ManifestPlugin = require('webpack-manifest-plugin'),
    ChunkManifestPlugin = require('chunk-manifest-webpack-plugin'),
    config = require('./../config');

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
    new CleanWebpackPlugin([config.webpack_paths.build], {
        // Without `root` CleanWebpackPlugin won't point to our
        // project and will fail to work.
        root: process.cwd()
    })
];

let commonConfig = {
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

exports.config = commonConfig;
exports.getEntries = (env) => {
    let res = {};
    for( let entry in config.webpack_entries) {
        if(config.webpack_entries.hasOwnProperty(entry)) {
            res[entry] = config.webpack_entries[entry].map(asset => {
                if (asset === 'index.js' || asset === 'styles.scss')
                    return path.join(config.webpack_paths.src, entry, asset);
                // is a module name
                return asset;
            });
            if (env === 'development') res[entry].push('webpack-hot-middleware/client', 'webpack/hot/dev-server');
        }
    }
    return res;
};

/*exports.getEntries = function (env) {

    fs.readdir(path.join(__dirname, '..', 'client', 'src'), (err, data) => {

        if (err) return err;

        let obj = new Object();

        data.forEach((dirName) => {
            obj[dirName] = new Array();
            let scriptPath = path.join(config.webpack_paths.src) + `./${dirName}/index.js`;
            let stylePath =  path.join(config.webpack_paths.src) + `./${dirName}/styles.scss`;
            if(fs.existsSync(scriptPath)) obj[dirName].push(scriptPath);
            if(fs.existsSync(stylePath)) obj[dirName].push(stylePath);
            if (env === 'development') obj[dirName].push('webpack-hot-middleware/client', 'webpack/hot/dev-server');
        });

        obj.vendor = config.webpack_paths.vendor;
        if (env === 'development') obj.vendor.push('webpack-hot-middleware/client', 'webpack/hot/dev-server');

    });

}*/
