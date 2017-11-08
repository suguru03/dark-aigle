'use strict';

const { createEachWithKey } = require('./internal/collection');

module.exports = Promise => {

  Promise.map = createEachWithKey(Array, createCallbackHandler);

  function createCallbackHandler(rest, resolve, result) {
    return function createCallback(index) {
      return res => {
        result[index] = res;
        --rest === 0 && resolve(result);
      };
    };
  }
};
