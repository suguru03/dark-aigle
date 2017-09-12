'use strict';

const { createEachWithKey } = require('./internal/collection');

Promise.map = createEachWithKey(createResult, createCallbackHandler);

function createResult(size) {
  return Array(size);
}

function createCallbackHandler(rest, resolve, result) {
  return function createCallback(index) {
    return res => {
      result[index] = res;
      --rest === 0 && resolve(result);
    };
  };
}
