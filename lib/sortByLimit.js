'use strict';

const { sort } = require('./internal/util');
const { createEachLimitWithKey } = require('./internal/collection');

module.exports = Promise => {

  Promise.sortByLimit = createEachLimitWithKey(Array, createCallbackHandler);

  function createCallbackHandler(rest, resolve, iterate, result, collection, keys) {
    return keys === undefined ?
      function createCallback(index) {
        return criteria => {
          result[index] = { criteria, value: collection[index] };
          --rest === 0 ? resolve(sort(result)) : iterate();
        };
      } :
      function createCallback(index) {
        return criteria => {
          result[index] = { criteria, value: collection[keys[index]] };
          --rest === 0 ? resolve(sort(result)) : iterate();
        };
      };
  }
};
