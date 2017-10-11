'use strict';

const { INTERNAL, compactArray } = require('./internal/util');
const { createEachWithKey } = require('./internal/collection');

const nativeReject = Promise.reject.bind(Promise);
const reject = createEachWithKey(Array, createCallbackHandler);

Promise.reject = function(collection, iterator) {
  return arguments.length <= 1 ? nativeReject(collection) : reject(collection, iterator);
};

function createCallbackHandler(rest, resolve, result, collection, keys) {
  return keys === undefined ?
    function createCallback(index) {
      return res => {
        result[index] = res ? INTERNAL : collection[index];
        --rest === 0 && resolve(compactArray(result));
      };
    } :
    function createCallback(index) {
      return res => {
        result[index] = res ? INTERNAL : collection[keys[index]];
        --rest === 0 && resolve(compactArray(result));
      };
    };
}
