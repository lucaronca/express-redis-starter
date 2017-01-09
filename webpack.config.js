'use strict';

const webpack = require('webpack'),
    merge = require('webpack-merge'),
    OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
    common = require('./webpack.common');

module.exports = function(env) {
  if (env === 'production') {
    return merge(common, {
      plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new OptimizeCssAssetsPlugin({
          cssProcessor: require('cssnano'),
          cssProcessorOptions: { discardComments: {removeAll: true } },
          canPrint: true
        })
      ]
    });
  }
};