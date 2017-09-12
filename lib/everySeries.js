'use strict';

const { createEachSeries } = require('./internal/collection');

Promise.everySeries = createEachSeries(true, createCallback);

function createCallback(rest, resolve, iterate) {
  return function done(res) {
    res ? --rest === 0 ? resolve(true) : iterate() : resolve(false);
  };
}
