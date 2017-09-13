'use strict';

const { createEachWithKey } = require('./internal/collection');

Promise.find = createEachWithKey(() => {}, createCallbackHandler);

function createCallbackHandler(rest, result, resolve, collection, keys) {
  return keys === undefined ?
    function createCallback(index) {
      return res => res ? resolve(collection[index]) : --rest === 0 && resolve();
    } :
    function createCallback(index) {
      return res => res ? resolve(collection[keys[index]]) : --rest === 0 && resolve();
    };
}
