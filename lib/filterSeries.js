'use strict';

const { compactArray } = require('./internal/util');

Promise.filterSeries = filterSeries;

function filterSeries(collection, iterator) {
  return Promise.mapSeries(collection, iterator).then(compactArray);
}
