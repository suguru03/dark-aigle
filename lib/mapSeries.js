'use strict';

const { createEachSeriesWithKey } = require('./internal/collection');

module.exports = Promise => {

  Promise.mapSeries = createEachSeriesWithKey(Array, createCallbackHandler);

  function createCallbackHandler(rest, resolve, iterate, result) {
    return function createCallback(index) {
      return res => {
        result[index] = res;
        --rest === 0 ? resolve(result) : iterate();
      };
    };
  }
};
