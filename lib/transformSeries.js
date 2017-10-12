'use strict';

const { errorObj, call4 } = require('./internal/util');

Promise.transformSeries = transformSeries;

function transformSeries(collection, iterator, result) {
  if (Array.isArray(collection)) {
    return callArrayEach(collection, iterator, result || []);
  }
  if (collection && typeof collection === 'object') {
    return callObjectEach(collection, iterator, result || {});
  }
  return Promise.resolve(result || {});
}

function callArrayEach(array, iterator, result) {
  const l = array.length;
  if (l === 0) {
    return Promise.resolve(result);
  }
  return new Promise((resolve, reject) => {
    let i = 0;
    iterate();
    function iterate() {
      const promise = call4(iterator, result, array[i], i, array);
      if (promise === errorObj) {
        return reject(errorObj.e);
      }
      promise && promise.then ? promise.then(done, reject) : done();
    }
    function done(bool) {
      (bool === false || ++i === l) ? resolve(result) : iterate();
    }
  });
}

function callObjectEach(object, iterator, result) {
  const keys = Object.keys(object);
  const l = keys.length;
  if (l === 0) {
    return Promise.resolve(result);
  }
  return new Promise((resolve, reject) => {
    let i = 0;
    iterate();
    function iterate() {
      const key = keys[i];
      const promise = call4(iterator, result, object[key], key, object);
      if (promise === errorObj) {
        return reject(errorObj.e);
      }
      promise && promise.then ? promise.then(done, reject) : done();
    }
    function done(bool) {
      (bool === false || ++i === l) ? resolve(result) : iterate();
    }
  });
}
