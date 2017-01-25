const path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
    PATHS = require('./../config').webpack_paths;

let config = {
    entry: {
        vendor: ['jquery', 'foundation-sites'],
            home: [path.join(PATHS.src, './home/index.js'), path.join(PATHS.src, './home/styles.scss')],
            upload: [path.join(PATHS.src, './upload/index.js'), path.join(PATHS.src, './upload/styles.scss')],
            login:  [path.join(PATHS.src, './login/index.js'), path.join(PATHS.src, './login/styles.scss')],
            common: path.join(PATHS.src, './commons/styles.scss')
    },
    output: {
        path: PATHS.build,
        filename: '[name].bundle.[chunkhash].js',
        chunkFilename: '[name].chunk.[chunkhash].js'
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
            },
            {
                test: /\.woff(2)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            type: 'application/font-woff'
                        }
                    }
                ]
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