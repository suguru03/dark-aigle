'use strict';

const { concatArray } = require('./internal/util');

Promise.concat = concat;

function concat(collection, iterator) {
  return Promise.map(collection, iterator).then(concatArray);
}
