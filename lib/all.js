'use strict';

module.exports = Promise => {

  // avoid override
  Promise.all = Promise.all || all;

  Promise.prototype.all = function all() {
    return this.then(Promise.all);
  };

  function all(array) {
    const l = Array.isArray(array) ? array.length : 0;
    if (l === 0) {
      return Promise.resolve([]);
    }
    return new Promise((resolve, reject) => {
      const result = Array(l);
      let i = -1;
      let rest = l;
      while (++i < l) {
        const promise = array[i];
        const done = createCallback(i);
        promise && promise.then ? promise.then(done, reject) : done(promise);
      }
      function createCallback(index) {
        return res => {
          result[index] = res;
          --rest === 0 && resolve(result);
        };
      }
    });
  }
};
