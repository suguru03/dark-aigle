'use strict';

const { INTERNAL, compactArray } = require('./internal/util');
const { createEachSeriesWithKey } = require('./internal/collection');

Promise.filterSeries = createEachSeriesWithKey(Array, createCallbackHandler);

function createCallbackHandler(rest, result, resolve, iterate, collection, keys) {
  return keys === undefined ?
    function createCallback(index) {
      return res => {
        result[index] = res ? collection[index] : INTERNAL;
        --rest === 0 ? resolve(compactArray(result)) : iterate();
      };
    } :
    function createCallback(index) {
      return res => {
        result[index] = res ? collection[keys[index]] : INTERNAL;
        --rest === 0 ? resolve(compactArray(result)) : iterate();
      };
    };
}
