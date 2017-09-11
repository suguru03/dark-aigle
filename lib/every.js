'use strict';

const { createEach } = require('./internal/collection');

Promise.every = createEach(true, createCallback);

function createCallback(rest, resolve) {
  return function done(res) {
    res ? --rest === 0 && resolve(true) : resolve(false);
  };
}
