'use strict';

const merge = require('webpack-merge'),
    dev = require('./webpack.dev.js'),
    prod = require('./webpack.prod.js'),
    common = require('./webpack.common.js').config;

module.exports = function(env) {

  if (env === 'production') {
    return merge(common, prod);
  }
  return merge(common, dev);

};