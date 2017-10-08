'use strict';

const { sort } = require('./internal/util');
const { createEachWithKey } = require('./internal/collection');

Promise.sortBy = createEachWithKey(Array, createCallbackHandler);

function createCallbackHandler(rest, resolve, result, collection, keys) {
  return keys === undefined ?
    function createCallback(index) {
      return criteria => {
        result[index] = { criteria, value: collection[index] };
        --rest === 0 && resolve(sort(result));
      };
    } :
    function createCallback(index) {
      return criteria => {
        result[index] = { criteria, value: collection[keys[index]] };
        --rest === 0 && resolve(sort(result));
      };
    };
}
