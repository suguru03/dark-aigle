'use strict';

const { createEachWithKey } = require('./internal/collection');

const findIndex = createEachWithKey(() => -1, createCallbackHandler);

Promise.findIndex = function(collection, iterator) {
  return Array.isArray(collection) ? findIndex(collection, iterator) : Promise.resolve(-1);
};

function createCallbackHandler(rest, resolve) {
  return function createCallback(index) {
    return res => res ? resolve(index) : --rest === 0 && resolve(-1);
  };
}
