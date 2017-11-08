'use strict';

const { noop } = require('./internal/util');
const { createEachLimit } = require('./internal/collection');

module.exports = Promise => {

  Promise.someLimit = createEachLimit(false, createCallback);

  function createCallback(rest, resolve, iterate) {
    return function done(res) {
      if (res) {
        iterate = noop;
        return resolve(true);
      }
      --rest === 0 ? resolve(false) : iterate();
    };
  }
};
