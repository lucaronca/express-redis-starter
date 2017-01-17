'use strict';

const merge = require('webpack-merge'),
    dev = require('./config/webpack.dev'),
    prod = require('./config/webpack.prod'),
    common = require('./config/webpack.common');

module.exports = function(env) {

  if (env === 'production') {
    return merge(common, prod);
  }
  return merge(common, dev);

};