'use strict';

const { concatArray } = require('./internal/util');

Promise.concatSeries = concatSeries;

function concatSeries(collection, iterator) {
  return Promise.mapSeries(collection, iterator).then(concatArray);
}
