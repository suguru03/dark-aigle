'use strict';

const { createEach } = require('./internal/collection');

Promise.some = createEach(false, createCallback);

function createCallback(rest, resolve) {
  return function done(res) {
    res ? resolve(true) : --rest === 0 && resolve(false);
  };
}
