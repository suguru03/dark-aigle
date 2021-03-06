'use strict';

const { createEach } = require('./internal/collection');

module.exports = Promise => {

  Promise.each = createEach(undefined, createCallback);
  Promise.forEach = Promise.each;

  function createCallback(rest, resolve) {
    return function done(res) {
      (res === false || --rest === 0) && resolve();
    };
  }
};
