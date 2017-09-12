'use strict';

const { DEFAULT_LIMIT, errorObj, call3, noop } = require('./util');

Object.assign(exports, {
  createEach,
  createEachSeries,
  createEachLimit
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

function createEachSeries(defaultResult, createCallback) {

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
      const done = createCallback(l, resolve, iterate);
      iterate();
      function iterate() {
        const promise = call3(iterator, array[++i], i, array);
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
      const done = createCallback(l, resolve, iterate);
      iterate();
      function iterate() {
        const key = keys[++i];
        const promise = call3(iterator, object[key], key, object);
        if (promise === errorObj) {
          return reject(errorObj.e);
        }
        promise && promise.then ? promise.then(done, reject) : done();
      }
    });
  }
}

function createEachLimit(defaultResult, createCallback) {

  return function(collection, limit, iterator) {
    if (typeof limit === 'function') {
      iterator = limit;
      limit = DEFAULT_LIMIT;
    }
    if (Array.isArray(collection)) {
      return arrayEachLimit(collection, limit, iterator);
    }
    if (collection && typeof collection === 'object') {
      return objectEachLimit(collection, limit, iterator);
    }
    return Promise.resolve(defaultResult);
  };

  function arrayEachLimit(array, limit, iterator) {
    const l = array.length;
    if (l === 0) {
      return Promise.resolve(defaultResult);
    }
    return new Promise((resolve, reject) => {
      let i = -1;
      limit = limit < l ? limit : l;
      let done = createCallback(resolve, iterate, l, l - limit);
      while (limit--) {
        iterate();
      }
      function iterate() {
        const promise = call3(iterator, array[++i], i, array);
        if (promise === errorObj) {
          return _reject(errorObj.e);
        }
        promise && promise.then ? promise.then(done, _reject) : done();
      }
      function _reject(reason) {
        done = noop;
        reject(reason);
      }
    });
  }

  function objectEachLimit(object, limit, iterator) {
    const keys = Object.keys(object);
    const l = keys.length;
    if (l === 0) {
      return Promise.resolve(defaultResult);
    }
    return new Promise((resolve, reject) => {
      let i = -1;
      limit = limit < l ? limit : l;
      let done = createCallback(resolve, iterate, l, l - limit);
      while (limit--) {
        iterate();
      }
      function iterate() {
        const key = keys[++i];
        const promise = call3(iterator, object[key], key, object);
        if (promise === errorObj) {
          return _reject(errorObj.e);
        }
        promise && promise.then ? promise.then(done, _reject) : done();
      }
      function _reject(reason) {
        done = noop;
        reject(reason);
      }
    });
  }
}
