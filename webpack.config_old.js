const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        home: './src/home/',
        upload: './src/upload/'
    },
	output: {
		path: path.resolve(__dirname, 'public'),
		publicPath: 'public',
		filename: 'bundle.[name].js',
        chunkFilename: '[id].js'
	},
	externals: {
		jQuery: 'jQuery',
		foundation: 'Foundation'
	},
    module: {
        loaders: [
        	// Javascript
            {
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: [/node_modules/],
                query: {
                  presets: 'es2015',
                }
            },
            // Stylesheets
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?minimize&sourceMap')
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?minimize&sourceMap!sass?sourceMap')
            },
            // Font Definitions
			{
				test: /\.(eot|woff|woff2|ttf|svg)(\?\S*)?$/,
				loader: 'url?limit=100000&name=fonts/[name].[ext]'
			}
        ]
    },
    sassLoader: {
        includePaths: [ 'client/style' ]
    },
    plugins: [
        // Avoid publishing files when compilation fails
        new webpack.NoErrorsPlugin(),
        // Specify the resulting filename (and add needed behavior to the compiler)
        new ExtractTextPlugin('[name].css')
    ],
    stats: {
        // Nice colored output
        colors: true
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map',
};