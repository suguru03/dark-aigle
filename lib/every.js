'use strict';

const { errorObj, call3 } = require('./internal/util');

Promise.every = every;

function every(collection, iterator) {
  if (Array.isArray(collection)) {
    return arrayevery(collection, iterator);
  }
  if (collection && typeof collection === 'object') {
    return objectevery(collection, iterator);
  }
  return Promise.resolve(true);
}

function arrayevery(array, iterator) {
  const l = array.length;
  if (l === 0) {
    return Promise.resolve(true);
  }
  return new Promise((resolve, reject) => {
    let i = -1;
    let rest = l;
    while (++i < l) {
      const promise = call3(iterator, array[i], i, array);
      if (promise === errorObj) {
        return reject(errorObj.e);
      }
      promise && promise.then ? promise.then(done, reject) : done();
    }
    function done(res) {
      res ? --rest === 0 && resolve(true) : resolve(false);
    }
  });
}

function objectevery(object, iterator) {
  const keys = Object.keys(object);
  const l = keys.length;
  if (l === 0) {
    return Promise.resolve(true);
  }
  return new Promise((resolve, reject) => {
    let i = -1;
    let rest = l;
    while (++i < l) {
      const key = keys[i];
      const promise = call3(iterator, object[key], key, object);
      if (promise === errorObj) {
        return reject(errorObj.e);
      }
      promise && promise.then ? promise.then(done, reject) : done();
    }
    function done(res) {
      res ? --rest === 0 && resolve(true) : resolve(false);
    }
  });
}