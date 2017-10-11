'use strict';

const { errorObj, call1 } = require('./internal/util');

Promise.timesSeries = timesSeries;
Promise.prototype.timesSeries = function timesSeries(iterator) {
  return this.then(n => Promise.timesSeries(n, iterator));
};

function timesSeries(n, iterator) {
  n = +n | 0;
  if (n <= 0) {
    return Promise.resolve([]);
  }
  const result = Array(n);
  if (typeof iterator !== 'function') {
    while (n--) {
      result[n] = n;
    }
    return Promise.resolve(result);
  }
  let rest = n;
  return new Promise((resolve, reject) => {
    let i = -1;
    iterate();
    function iterate() {
      const promise = call1(iterator, ++i);
      if (promise === errorObj) {
        return reject(errorObj.e);
      }
      const done = createCallback(i);
      promise && promise.then ? promise.then(done, reject) : done(promise);
    }
    function createCallback(index) {
      return res => {
        result[index] = res;
        --rest === 0 ? resolve(result) : iterate();
      };
    }
  });
}
