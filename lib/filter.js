'use strict';

const { compactArray } = require('./internal/util');

Promise.filter = filter;

function filter(collection, iterator) {
  return Promise.map(collection, iterator).then(compactArray);
}
