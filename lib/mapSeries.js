'use strict';

const { errorObj, call3 } = require('./internal/util');

Promise.mapSeries = mapSeries;

function mapSeries(collection, iterator) {
  if (Array.isArray(collection)) {
    return arrayMapSeries(collection, iterator);
  }
  if (collection && typeof collection === 'object') {
    return objectMapSeries(collection, iterator);
  }
  return Promise.resolve([]);
}

function arrayMapSeries(array, iterator) {
  const l = array.length;
  const result = Array(l);
  if (l === 0) {
    return Promise.resolve(result);
  }
  return new Promise((resolve, reject) => {
    let i = 0;
    iterate(i);
    function iterate(i) {
      const promise = call3(iterator, array[i], i, array);
      if (promise === errorObj) {
        return reject(errorObj.e);
      }
      const done = createCallback(i);
      promise && promise.then ? promise.then(done, reject) : done(promise);
    }
    function createCallback(index) {
      return res => {
        result[index] = res;
        ++i === l ? resolve(result) : iterate(i);
      };
    }
  });
}

function objectMapSeries(object, iterator) {
  const keys = Object.keys(object);
  const l = keys.length;
  const result = Array(l);
  if (l === 0) {
    return Promise.resolve(result);
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
      const done = createCallback(i);
      promise && promise.then ? promise.then(done, reject) : done(promise);
    }
    function createCallback(index) {
      return res => {
        result[index] = res;
        ++i === l ? resolve(result) : iterate(i);
      };
    }
  });
}
