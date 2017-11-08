'use strict';

const { INTERNAL, compactArray } = require('./internal/util');
const { createEachWithKey } = require('./internal/collection');

module.exports = Promise => {

  Promise.filter = createEachWithKey(Array, createCallbackHandler);

  function createCallbackHandler(rest, resolve, result, collection, keys) {
    return keys === undefined ?
      function createCallback(index) {
        return res => {
          result[index] = res ? collection[index] : INTERNAL;
          --rest === 0 && resolve(compactArray(result));
        };
      } :
      function createCallback(index) {
        return res => {
          result[index] = res ? collection[keys[index]] : INTERNAL;
          --rest === 0 && resolve(compactArray(result));
        };
      };
  }
};
