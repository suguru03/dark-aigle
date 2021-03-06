'use strict';

const { concatArray } = require('./internal/util');

module.exports = Promise => {

  Promise.concatSeries = concatSeries;

  function concatSeries(collection, iterator) {
    return Promise.mapSeries(collection, iterator).then(concatArray);
  }
};
