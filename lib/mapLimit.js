'use strict';

const { createEachLimitWithKey } = require('./internal/collection');

Promise.mapLimit = createEachLimitWithKey(Array, createCallbackHandler);

function createCallbackHandler(rest, resolve, iterate, result) {
  return function createCallback(index) {
    return res => {
      result[index] = res;
      --rest === 0 ? resolve(result) : iterate();
    };
  };
}
