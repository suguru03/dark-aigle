'use strict';

const { errorObj, call1 } = require('./internal/util');

Promise.until = until;

function until(value, tester, iterator) {
  if (typeof iterator !== 'function') {
    iterator = tester;
    tester = value;
    value = undefined;
  }
  return new Promise((resolve, reject) => {

    test(value);

    function test(val) {
      value = val;
      const promise = call1(tester, value);
      if (promise === errorObj) {
        return reject(errorObj.e);
      }
      promise && promise.then ? promise.then(iterate, reject) : iterate(promise);
    }

    function iterate(bool) {
      if (bool) {
        return resolve(value);
      }
      const promise = call1(iterator, value);
      if (promise === errorObj) {
        return reject(errorObj.e);
      }
      promise && promise.then ? promise.then(test, reject) : test(promise);
    }
  });
}
