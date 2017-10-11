'use strict';

require('./delay');
require('./finally');
require('./props');
require('./times');
require('./timesSeries');

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
  { name: 'reduce' },
  { name: 'reject' },
  { name: 'rejectSeries' },
  { name: 'rejectLimit' },
  { name: 'some' },
  { name: 'someSeries' },
  { name: 'someLimit' },
  { name: 'sortBy' },
  { name: 'sortBySeries' },
  { name: 'sortByLimit' }
].forEach(({ name, alias }) => {
  require(`./${name}`);
  Promise.prototype[name] = /(^reduce|Limit)$/.test(name) ?
    function (arg1, arg2) {
      return this.then(collection => Promise[name](collection, arg1, arg2));
    } :
    function(arg1) {
      return this.then(collection => Promise[name](collection, arg1));
    };
  if (alias) {
    Promise[alias] = Promise[name];
    Promise.prototype[alias] = Promise.prototype[name];
  }
});

module.exports = Promise;
