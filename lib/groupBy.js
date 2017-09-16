'use strict';

const { createEachWithKey } = require('./internal/collection');

Promise.groupBy = createEachWithKey(() => ({}), createCallbackHandler);

function createCallbackHandler(rest, resolve, result, collection, keys) {
  return keys === undefined ?
    function createCallback(index) {
      return res => {
        if (result[res]) {
          result[res].push(collection[index]);
        } else {
          result[res] = [collection[index]];
        }
        --rest === 0 && resolve(result);
      };
    } :
    function createCallback(index) {
      return res => {
        if (result[res]) {
          result[res].push(collection[keys[index]]);
        } else {
          result[res] = [collection[keys[index]]];
        }
        --rest === 0 && resolve(result);
      };
    };
}
