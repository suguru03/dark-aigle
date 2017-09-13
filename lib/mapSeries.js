'use strict';

const { createEachSeriesWithKey } = require('./internal/collection');

Promise.mapSeries = createEachSeriesWithKey(Array, createCallbackHandler);

function createCallbackHandler(rest, resolve, result, iterate) {
  return function createCallback(index) {
    return res => {
      result[index] = res;
      --rest === 0 ? resolve(result) : iterate();
    };
  };
}
