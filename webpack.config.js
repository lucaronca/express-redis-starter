'use strict';

const merge = require('webpack-merge'),
    dev = require('./config/webpack.dev.config'),
    prod = require('./config/webpack.prod.config'),
    common = require('./config/webpack.common');

module.exports = function(env) {

  if (env === 'production') {
    return merge(common, prod);
  }
  return merge(common, dev);

};