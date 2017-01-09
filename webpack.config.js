'use strict';

const path = require('path'),
    webpack = require('webpack'),
    merge = require('webpack-merge'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

const PATHS = {
  build: path.join(__dirname, 'public', 'build')
}

let plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: 2
  }),
  /*new webpack.LoaderOptionsPlugin({
    options: {
      sassLoader: {
        sourceMaps: true,
        includePaths: [path.resolve(__dirname, './node_modules')]
      }
    }
  }),*/
  new webpack.ProvidePlugin({
    $: path.join(__dirname, 'node_modules', 'jquery/dist/jquery'),
    jQuery: path.join(__dirname, 'node_modules', 'jquery/dist/jquery')
  }),
  new ExtractTextPlugin({ filename: '[name].styles.[chunkhash].css', allChunks: true }),
  new CleanWebpackPlugin([PATHS.build], {
    // Without `root` CleanWebpackPlugin won't point to our
    // project and will fail to work.
    root: process.cwd()
  })
];

module.exports = function(env) {
  if (env === 'production') {
    return merge({
      context: path.join(__dirname, 'public', 'app'),
      entry: {
        vendor: ['jquery', 'foundation-sites'],
        home: ['./home/index.js', './home/styles.scss'],
        upload: ['./upload/index.js', './upload/styles.scss'],
        commonStyles: './commons/styles.scss'
      },
      output: {
        path: PATHS.build,
        filename: '[name].bundle.[chunkhash].js',
        chunkFilename: '[name].chunk.[chunkhash].js'
      },
      /*resolve: {
        alias: {
          'foundation-sites': path.join(__dirname, 'node_modules', 'foundation-sites', 'scss', 'foundation.scss')
        }
      },*/
      module: {
        noParse: /node_modules\/foundation-sites/,
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          },
          {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({
              fallbackLoader: 'style-loader',
              loader: [
                'css-loader?sourceMap',
                'sass-loader?sourceMap&' +
                'includePaths[]=' + path.resolve(__dirname, './node_modules')
              ]
            })
          },
          { 
            test: /\.otf$|\.eot$|\.svg$|\.woff2?$|\.ttf$/,
            loader: 'file-loader?name=[path][name].[ext]' 
          }
        ]
      },
      plugins: plugins,
      devtool: 'source-map',
      stats: {
        // Nice colored output
        colors: true
      }
    });
  }
};