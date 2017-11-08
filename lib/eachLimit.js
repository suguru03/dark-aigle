'use strict';

const { noop } = require('./internal/util');
const { createEachLimit } = require('./internal/collection');

module.exports = Promise => {

  Promise.eachLimit = createEachLimit(undefined, createCallback);
  Promise.forEachLimit = Promise.eachLimit;

  function createCallback(rest, resolve, iterate) {
    return function done(res) {
      if (res === false) {
        iterate = noop;
        return resolve();
      }
      --rest === 0 ? resolve() : iterate();
    };
  }
};
