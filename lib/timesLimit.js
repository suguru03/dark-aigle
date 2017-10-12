'use strict';

const { DEFAULT_LIMIT, errorObj, call1 } = require('./internal/util');

Promise.timesLimit = timesLimit;
Promise.prototype.timesLimit = function timesLimit(limit, iterator) {
  return this.then(n => Promise.timesLimit(n, limit, iterator));
};

function timesLimit(n, limit, iterator) {
  if (typeof limit === 'function') {
    iterator = limit;
    limit = DEFAULT_LIMIT;
  }
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
    limit = limit < n ? limit : n;
    while (limit--) {
      iterate();
    }
    function iterate() {
      if (++i >= n) {
        return;
      }
      const promise = call1(iterator, i);
      if (promise === errorObj) {
        return _reject(errorObj.e);
      }
      const done = createCallback(i);
      promise && promise.then ? promise.then(done, _reject) : done(promise);
    }
    function createCallback(index) {
      return res => {
        result[index] = res;
        --rest === 0 ? resolve(result) : iterate();
      };
    }
    function _reject(reason) {
      i = n;
      reject(reason);
    }
  });
}
