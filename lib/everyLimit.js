'use strict';

const { noop } = require('./internal/util');
const { createEachLimit } = require('./internal/collection');

module.exports = Promise => {

  Promise.everyLimit = createEachLimit(true, createCallback);

  function createCallback(rest, resolve, iterate) {
    return function done(res) {
      if (!res) {
        iterate = noop;
        return resolve(false);
      }
      --rest === 0 ? resolve(true) : iterate();
    };
  }
};
