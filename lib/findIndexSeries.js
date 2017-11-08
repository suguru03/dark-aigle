'use strict';

const { createEachSeriesWithKey } = require('./internal/collection');

module.exports = Promise => {

  const findIndexSeries = createEachSeriesWithKey(() => -1, createCallbackHandler);

  Promise.findIndexSeries = function(collection, iterator) {
    return Array.isArray(collection) ? findIndexSeries(collection, iterator) : Promise.resolve(-1);
  };

  function createCallbackHandler(rest, resolve, iterate) {
    return function createCallback(index) {
      return res => res ? resolve(index) : --rest === 0 ? resolve(-1) : iterate();
    };
  }
};
