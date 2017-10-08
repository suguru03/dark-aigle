'use strict';

require('./delay');
require('./finally');
require('./props');

// collection functions
[
  { name: 'concat' },
  { name: 'concatSeries' },
  { name: 'concatLimit' },
  { name: 'each', alias: 'forEach' },
  { name: 'eachSeries', alias: 'forEachSeries' },
  { name: 'eachLimit', alias: 'forEachLimit' },
  { name: 'every' },
  { name: 'everySeries' },
  { name: 'everyLimit' },
  { name: 'filter' },
  { name: 'filterSeries' },
  { name: 'filterLimit' },
  { name: 'find' },
  { name: 'findSeries' },
  { name: 'findLimit' },
  { name: 'findIndex' },
  { name: 'findIndexSeries' },
  { name: 'findIndexLimit' },
  { name: 'findKey' },
  { name: 'findKeySeries' },
  { name: 'findKeyLimit' },
  { name: 'groupBy' },
  { name: 'groupBySeries' },
  { name: 'groupByLimit' },
  { name: 'map' },
  { name: 'mapSeries' },
  { name: 'mapLimit' },
  { name: 'mapValues' },
  { name: 'mapValuesSeries' },
  { name: 'mapValuesLimit' },
  { name: 'pick' },
  { name: 'pickSeries' },
  { name: 'pickLimit' },
  { name: 'omit' },
  { name: 'omitSeries' },
  { name: 'omitLimit' },
  { name: 'some' },
  { name: 'someSeries' },
  { name: 'someLimit' },
  { name: 'sortBy' },
  { name: 'sortBySeries' }
].forEach(({ name, alias }) => {
  require(`./${name}`);
  Promise.prototype[name] = /Limit$/.test(name) ?
    function (limit, iterator) {
      return this.then(collection => Promise[name](collection, limit, iterator));
    } :
    function(iterator) {
      return this.then(collection => Promise[name](collection, iterator));
    };
  if (alias) {
    Promise[alias] = Promise[name];
    Promise.prototype[alias] = Promise.prototype[name];
  }
});

module.exports = Promise;
