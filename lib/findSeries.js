'use strict';

const { createEachSeriesWithKey } = require('./internal/collection');

module.exports = Promise => {

  Promise.findSeries = createEachSeriesWithKey(() => {}, createCallbackHandler);

  function createCallbackHandler(rest, resolve, iterate, result, collection, keys) {
    return keys === undefined ?
      function createCallback(index) {
        return res => res ? resolve(collection[index]) : --rest === 0 ? resolve() : iterate();
      } :
      function createCallback(index) {
        return res => res ? resolve(collection[keys[index]]) : --rest === 0 ? resolve() : iterate();
      };
  }
};
