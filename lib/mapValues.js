'use strict';

const { createEachWithKey } = require('./internal/collection');

module.exports = Promise => {

  Promise.mapValues = createEachWithKey(() => ({}), createCallbackHandler);

  function createCallbackHandler(rest, resolve, result, collection, keys) {
    return keys === undefined ?
      function createCallback(index) {
        return res => {
          result[index] = res;
          --rest === 0 && resolve(result);
        };
      } :
      function createCallback(index) {
        return res => {
          result[keys[index]] = res;
          --rest === 0 && resolve(result);
        };
      };
  }
};
