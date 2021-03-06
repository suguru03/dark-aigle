'use strict';

const { createEachSeriesWithKey } = require('./internal/collection');

module.exports = Promise => {

  Promise.mapValuesSeries = createEachSeriesWithKey(() => ({}), createCallbackHandler);

  function createCallbackHandler(rest, resolve, iterate, result, collection, keys) {
    return keys === undefined ?
      function createCallback(index) {
        return res => {
          result[index] = res;
          --rest === 0 ? resolve(result) : iterate();
        };
      } :
      function createCallback(index) {
        return res => {
          result[keys[index]] = res;
          --rest === 0 ? resolve(result) : iterate();
        };
      };
  }
};
