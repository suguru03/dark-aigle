'use strict';

const { createEachWithKey } = require('./internal/collection');

Promise.map = createEachWithKey(Array, createCallbackHandler);

function createCallbackHandler(rest, result, resolve) {
  return function createCallback(index) {
    return res => {
      result[index] = res;
      --rest === 0 && resolve(result);
    };
  };
}
