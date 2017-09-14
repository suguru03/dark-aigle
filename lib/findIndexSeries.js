'use strict';

const { createEachSeriesWithKey } = require('./internal/collection');

const findIndexSeries = createEachSeriesWithKey(() => -1, createCallbackHandler);

Promise.findIndexSeries = function(collection, iterator) {
  return Array.isArray(collection) ? findIndexSeries(collection, iterator) : Promise.resolve(-1);
};

function createCallbackHandler(rest, resolve, result, iterate) {
  return function createCallback(index) {
    return res => res ? resolve(index) : --rest === 0 ? resolve(-1) : iterate();
  };
}
