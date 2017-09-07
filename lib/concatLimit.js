'use strict';

const { concatArray } = require('./internal/util');

Promise.concatLimit = concatLimit;

function concatLimit(collection, limit, iterator) {
  return Promise.mapLimit(collection, limit, iterator).then(concatArray);
}
