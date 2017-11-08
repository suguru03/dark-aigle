'use strict';

const { createEachWithKey } = require('./internal/collection');

module.exports = Promise => {

  Promise.omit = createEachWithKey(() => ({}), createCallbackHandler);

  function createCallbackHandler(rest, resolve, result, collection, keys) {
    return keys === undefined ?
      function createCallback(index) {
        return res => {
          if (!res) {
            result[index] = collection[index];
          }
          --rest === 0 && resolve(result);
        };
      } :
      function createCallback(index) {
        return res => {
          if (!res) {
            const key = keys[index];
            result[key] = collection[key];
          }
          --rest === 0 && resolve(result);
        };
      };
  }
};
