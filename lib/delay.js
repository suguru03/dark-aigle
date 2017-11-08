'use strict';

module.exports = Promise => {

  Promise.delay = function delay(ms, value) {
    return new Promise(resolve => setTimeout(resolve, ms, value));
  };

  Promise.prototype.delay = function delay(ms) {
    return this.then(value => Promise.delay(ms, value));
  };
};
