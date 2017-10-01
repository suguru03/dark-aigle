'use strict';

const { createEachLimitWithKey } = require('./internal/collection');

Promise.omitLimit = createEachLimitWithKey(() => ({}), createCallbackHandler);

function createCallbackHandler(rest, resolve, iterate, result, collection, keys) {
  return keys === undefined ?
    function createCallback(index) {
      return res => {
        if (!res) {
          result[index] = collection[index];
        }
        --rest === 0 ? resolve(result) : iterate();
      };
    } :
    function createCallback(index) {
      return res => {
        if (!res) {
          const key = keys[index];
          result[key] = collection[key];
        }
        --rest === 0 ? resolve(result) : iterate();
      };
    };
}
