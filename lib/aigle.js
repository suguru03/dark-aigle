'use strict';

require('./delay');
require('./finally');
require('./props');

// collection functions
[
  { name: 'concat' },
  { name: 'each', alias: 'forEach' },
  { name: 'eachSeries', alias: 'forEachSeries' },
  { name: 'eachLimit', alias: 'forEachLimit' },
  { name: 'map' },
  { name: 'mapSeries' },
  { name: 'mapLimit' }
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
