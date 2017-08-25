'use strict';

const { errorObj, call3 } = require('./internal/util');

Promise.eachSeries = eachSeries;
Promise.forEachSeries = eachSeries;

function eachSeries(collection, iterator) {
  if (Array.isArray(collection)) {
    return arrayEachSeries(collection, iterator);
  }
  if (collection && typeof collection === 'object') {
    return objectEachSeries(collection, iterator);
  }
  return Promise.resolve();
}

function arrayEachSeries(array, iterator) {
  const l = array.length;
  if (l === 0) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    let i = 0;
    iterate(i);
    function iterate(i) {
      const promise = call3(iterator, array[i], i, array);
      if (promise === errorObj) {
        return reject(errorObj.e);
      }
      promise && promise.then ? promise.then(done, reject) : done();
    }
    function done(res) {
      (res === false || ++i === l) ? resolve() : iterate(i);
    }
  });
}

function objectEachSeries(object, iterator) {
  const keys = Object.keys(object);
  const l = keys.length;
  if (l === 0) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    let i = 0;
    iterate(i);
    function iterate(i) {
      const key = keys[i];
      const promise = call3(iterator, object[key], key, object);
      if (promise === errorObj) {
        return reject(errorObj.e);
      }
      promise && promise.then ? promise.then(done, reject) : done();
    }
    function done(res) {
      (res === false || ++i === l) ? resolve() : iterate(i);
    }
  });
}
