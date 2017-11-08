'use strict';

const { createEachLimitWithKey } = require('./internal/collection');

module.exports = Promise => {

  Promise.findKeyLimit = createEachLimitWithKey(() => {}, createCallbackHandler);

  function createCallbackHandler(rest, resolve, iterate, result, collection, keys) {
    return keys === undefined ?
      function createCallback(index) {
        return res => res ? resolve(`${index}`) : --rest === 0 ? resolve() : iterate();
      } :
      function createCallback(index) {
        return res => res ? resolve(keys[index]) : --rest === 0 ? resolve() : iterate();
      };
  }
};
