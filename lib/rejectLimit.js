'use strict';

const { INTERNAL, compactArray } = require('./internal/util');
const { createEachLimitWithKey } = require('./internal/collection');

module.exports = Promise => {

  Promise.rejectLimit = createEachLimitWithKey(Array, createCallbackHandler);

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
};
