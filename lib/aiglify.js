'use strict';

module.exports = aiglify;

const collection = [
  { name: 'concat' },
  { name: 'concatSeries' },
  { name: 'concatLimit' },
  { name: 'doUntil' },
  { name: 'doWhilst' },
  { name: 'each', alias: 'forEach' },
  { name: 'eachSeries', alias: 'forEachSeries' },
  { name: 'eachLimit', alias: 'forEachLimit' },
  { name: 'every' },
  { name: 'everySeries' },
  { name: 'everyLimit' },
  { name: 'filter' },
  { name: 'filterSeries' },
  { name: 'filterLimit' },
  { name: 'find', alias: 'detect' },
  { name: 'findSeries', alias: 'detectSeries' },
  { name: 'findLimit', alias: 'detectLimit' },
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
  { name: 'reject', override: true },
  { name: 'rejectSeries' },
  { name: 'rejectLimit' },
  { name: 'some' },
  { name: 'someSeries' },
  { name: 'someLimit' },
  { name: 'sortBy' },
  { name: 'sortBySeries' },
  { name: 'sortByLimit' },
  { name: 'transform' },
  { name: 'transformSeries' },
  { name: 'transformLimit' },
  { name: 'whilst' },
  { name: 'until' }
];

const others = [
  { name: 'all', override: true },
  { name: 'attempt' },
  { name: 'delay' },
  { name: 'finally' },
  { name: 'join' },
  { name: 'parallel' },
  { name: 'promisify' },
  { name: 'promisifyAll' },
  { name: 'props' },
  { name: 'race', override: true },
  { name: 'times' },
  { name: 'timesSeries' },
  { name: 'timesLimit' }
];

function aiglify(Promise) {

  // collection functions
  collection.forEach(({ name, alias, override }) => {
    if (!override && Promise.hasOwnProperty(name)) {
      return;
    }
    require(`./${name}`)(Promise);
    Promise.prototype[name] = createFunction(Promise, name);
    if (alias) {
      Promise[alias] = Promise[name];
      Promise.prototype[alias] = Promise.prototype[name];
    }
  });

  // other functions
  others.forEach(({ name, override }) => (override || !Promise.hasOwnProperty(name)) && require(`./${name}`)(Promise));

  return Promise;
}

function createFunction(Promise, name) {
  switch (/^transformLimit$/.test(name) ? 3 : /(^reduce|^transform|Limit|whilst|until)$/i.test(name) ? 2 : 1) {
  case 1:
    return function(arg1) {
      return this.then(collection => Promise[name](collection, arg1));
    };
  case 2:
    return function (arg1, arg2) {
      return this.then(collection => Promise[name](collection, arg1, arg2));
    };
  case 3:
    return function (arg1, arg2, arg3) {
      return this.then(collection => Promise[name](collection, arg1, arg2, arg3));
    };
  }
}
