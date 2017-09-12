'use strict';

const { createEachSeries } = require('./internal/collection');

Promise.eachSeries = createEachSeries(undefined, createCallback);
Promise.forEachSeries = Promise.eachSeries;

function createCallback(rest, resolve, iterate) {
  return function done(res) {
    (res === false || --rest === 0) ? resolve() : iterate();
  };
}
