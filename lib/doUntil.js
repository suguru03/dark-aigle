'use strict';

const { errorObj, call1 } = require('./internal/util');

Promise.doUntil = doUntil;

function doUntil(value, iterator, tester) {
  if (typeof tester !== 'function') {
    tester = iterator;
    iterator = value;
    value = undefined;
  }
  return new Promise((resolve, reject) => {

    iterate(false);

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
