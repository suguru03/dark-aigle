'use strict';

const { createEachLimit } = require('./internal/collection');

Promise.eachLimit = createEachLimit(undefined, createCallback);
Promise.forEachLimit = Promise.eachLimit;

function createCallback(resolve, iterate, rest, callRest) {
  return function done(res) {
    if (res === false) {
      callRest = 0;
      return resolve();
    }
    --rest === 0 ? resolve() : callRest-- > 0 && iterate();
  };
}
