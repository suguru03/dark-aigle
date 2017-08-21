'use strict';

const { errorObj, call3 } = require('./internal/util');

Promise.map = map;

function map(collection, iterator) {
  if (Array.isArray(collection)) {
    return arrayMap(collection, iterator);
  }
  if (collection && typeof collection === 'object') {
    return objectMap(collection, iterator);
  }
  return Promise.resolve([]);
}

function arrayMap(array, iterator) {
  const l = array.length;
  const result = Array(l);
  if (l === 0) {
    return Promise.resolve(result);
  }
  return new Promise((resolve, reject) => {
    let i = -1;
    let rest = l;
    while (++i < l) {
      const promise = call3(iterator, array[i], i, array);
      if (promise === errorObj) {
        return reject(errorObj.e);
      }
      const done = createCallback(i);
      promise && promise.then ? promise.then(done, reject) : done();
    }
    function createCallback(index) {
      return res => {
        result[index] = res;
        --rest === 0 && resolve(result);
      };
    }
  });
}

function objectMap(object, iterator) {
  const keys = Object.keys(object);
  const l = keys.length;
  const result = Array(l);
  if (l === 0) {
    return Promise.resolve(result);
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
      const done = createCallback(i);
      promise && promise.then ? promise.then(done, reject) : done();
    }
    function createCallback(index) {
      return res => {
        result[index] = res;
        --rest === 0 && resolve(result);
      };
    }
  });
}
