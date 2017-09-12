'use strict';

const { createEachLimitWithKey } = require('./internal/collection');

Promise.mapLimit = createEachLimitWithKey(Array, createCallbackHandler);

function createCallbackHandler(rest, result, resolve, iterate) {
  return function createCallback(index) {
    return res => {
      result[index] = res;
      --rest === 0 ? resolve(result) : iterate();
    };
  };
}
