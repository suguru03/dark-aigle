'use strict';

const { createEachLimitWithKey } = require('./internal/collection');

module.exports = Promise => {

  Promise.groupByLimit = createEachLimitWithKey(() => ({}), createCallbackHandler);

  function createCallbackHandler(rest, resolve, iterate, result, collection, keys) {
    return keys === undefined ?
      function createCallback(index) {
        return res => {
          if (result[res]) {
            result[res].push(collection[index]);
          } else {
            result[res] = [collection[index]];
          }
          --rest === 0 ? resolve(result) : iterate();
        };
      } :
      function createCallback(index) {
        return res => {
          if (result[res]) {
            result[res].push(collection[keys[index]]);
          } else {
            result[res] = [collection[keys[index]]];
          }
          --rest === 0 ? resolve(result) : iterate();
        };
      };
  }
};
