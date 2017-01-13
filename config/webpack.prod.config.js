const path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
    PATHS = require('./paths');

let config = {
    entry: {
        vendor: ['jquery', 'foundation-sites'],
            home: [path.join(PATHS.app, './home/index.js'), path.join(PATHS.app, './home/styles.scss')],
            upload: [path.join(PATHS.app, './upload/index.js'), path.join(PATHS.app, './upload/styles.scss')],
            common: path.join(PATHS.app, './commons/styles.scss')
    },
    module: {
        rules: [
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
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin({
            filename: '[name].styles.[chunkhash].css',
            allChunks: true
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: {removeAll: true } },
            canPrint: true
        })
    ]
};

module.exports = config;