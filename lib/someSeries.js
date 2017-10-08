'use strict';

const { createEachSeries } = require('./internal/collection');

Promise.someSeries = createEachSeries(false, createCallback);

function createCallback(rest, resolve, iterate) {
  return function done(res) {
    res ? resolve(true) : --rest === 0 ? resolve(false) : iterate();
  };
}
