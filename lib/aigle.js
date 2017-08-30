'use strict';

require('./delay');
require('./finally');

// collection functions
[
  { name: 'concat' },
  { name: 'each', alias: 'forEach' },
  { name: 'eachSeries', alias: 'forEachSeries' },
  { name: 'map' }
].forEach(({ name, alias }) => {
  require(`./${name}`);
  Promise.prototype[name] = function(iterator) {
    return this.then(collection => Promise[name](collection, iterator));
  };
  if (alias) {
    Promise[alias] = Promise[name];
    Promise.prototype[alias] = Promise.prototype[name];
  }
});
