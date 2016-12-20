const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: './src/app.js',
	output: {
		path: path.resolve(__dirname, 'public'),
		publicPath: 'public',
		filename: 'bundle.[name].js'
	},
	externals: {
		jQuery: 'jQuery',
		foundation: 'Foundation'
	},
    module: {
        loaders: [
        	// Javascript
            {
                loader: 'babel',
                test: 'src/app.js',
                query: {
                  presets: 'es2015',
                }
            },
            // Stylesheets
            {
                test: /\.(css|scss)$/,
                loaders: [ 'style', 'css?sourceMap', 'sass?sourceMap' ]
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
        new webpack.NoErrorsPlugin()
    ],
    stats: {
        // Nice colored output
        colors: true
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map',
};