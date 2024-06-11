'use strict';

require('./build')();

module.exports = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html'
      }
    ];
  }
};