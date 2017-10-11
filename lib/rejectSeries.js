'use strict';

const { INTERNAL, compactArray } = require('./internal/util');
const { createEachSeriesWithKey } = require('./internal/collection');

Promise.rejectSeries = createEachSeriesWithKey(Array, createCallbackHandler);

function createCallbackHandler(rest, resolve, iterate, result, collection, keys) {
  return keys === undefined ?
    function createCallback(index) {
      return res => {
        result[index] = res ? INTERNAL : collection[index];
        --rest === 0 ? resolve(compactArray(result)) : iterate();
      };
    } :
    function createCallback(index) {
      return res => {
        result[index] = res ? INTERNAL : collection[keys[index]];
        --rest === 0 ? resolve(compactArray(result)) : iterate();
      };
    };
}
