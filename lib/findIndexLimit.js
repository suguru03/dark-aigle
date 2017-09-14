'use strict';

const { createEachLimitWithKey } = require('./internal/collection');

const findIndexLimit = createEachLimitWithKey(() => -1, createCallbackHandler);

Promise.findIndexLimit = function(collection, limit, iterator) {
  return Array.isArray(collection) ? findIndexLimit(collection, limit, iterator) : Promise.resolve(-1);
};

function createCallbackHandler(rest, resolve, iterate) {
  return function createCallback(index) {
    return res => res ? resolve(index) : --rest === 0 ? resolve(-1) : iterate();
  };
}
