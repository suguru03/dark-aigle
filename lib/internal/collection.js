'use strict';

const { errorObj, call3 } = require('./util');

Object.assign(exports, {
  createEach
});

function createEach(defaultResult, createCallback) {

  return function(collection, iterator) {
    if (Array.isArray(collection)) {
      return callArrayEach(collection, iterator);
    }
    if (collection && typeof collection === 'object') {
      return callObjectEach(collection, iterator);
    }
    return Promise.resolve(defaultResult);
  };

  function callArrayEach(array, iterator) {
    const l = array.length;
    if (l === 0) {
      return Promise.resolve(defaultResult);
    }
    return new Promise((resolve, reject) => {
      let i = -1;
      const done = createCallback(l, resolve, reject);
      while (++i < l) {
        const promise = call3(iterator, array[i], i, array);
        if (promise === errorObj) {
          return reject(errorObj.e);
        }
        promise && promise.then ? promise.then(done, reject) : done();
      }
    });
  }

  function callObjectEach(object, iterator) {
    const keys = Object.keys(object);
    const l = keys.length;
    if (l === 0) {
      return Promise.resolve(defaultResult);
    }
    return new Promise((resolve, reject) => {
      let i = -1;
      const done = createCallback(l, resolve, reject);
      while (++i < l) {
        const key = keys[i];
        const promise = call3(iterator, object[key], key, object);
        if (promise === errorObj) {
          return reject(errorObj.e);
        }
        promise && promise.then ? promise.then(done, reject) : done();
      }
    });
  }
}

