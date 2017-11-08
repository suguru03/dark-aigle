'use strict';

const { createEachWithKey } = require('./internal/collection');

module.exports = Promise => {

  Promise.findKey = createEachWithKey(() => {}, createCallbackHandler);

  function createCallbackHandler(rest, resolve, result, collection, keys) {
    return keys === undefined ?
      function createCallback(index) {
        return res => res ? resolve(`${index}`) : --rest === 0 && resolve();
      } :
      function createCallback(index) {
        return res => res ? resolve(keys[index]) : --rest === 0 && resolve();
      };
  }
};
