'use strict';

const { DEFAULT_LIMIT, errorObj, call3 } = require('./internal/util');

Promise.eachLimit = eachLimit;
Promise.forEachLimit = eachLimit;

function eachLimit(collection, limit, iterator) {
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
  return Promise.resolve();
}

function arrayEachLimit(array, limit, iterator) {
  const l = array.length;
  if (l === 0) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    let i = -1;
    let rest = l;
    limit = limit < l ? limit : l;
    let callRest = l - limit;
    while (limit--) {
      iterate();
    }
    function iterate() {
      const promise = call3(iterator, array[++i], i, array);
      if (promise === errorObj) {
        return _reject(errorObj.e);
      }
      promise && promise.then ? promise.then(_resolve, _reject) : _resolve();
    }
    function _resolve(res) {
      if (res === false) {
        callRest = 0;
        return resolve();
      }
      --rest === 0 ? resolve() : callRest-- > 0 && iterate();
    }
    function _reject(reason) {
      callRest = 0;
      reject(reason);
    }
  });
}

function objectEachLimit(object, limit, iterator) {
  const keys = Object.keys(object);
  const l = keys.length;
  if (l === 0) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    let i = -1;
    let rest = l;
    limit = limit < l ? limit : l;
    let callRest = l - limit;
    while (limit--) {
      iterate();
    }
    function iterate() {
      const key = keys[++i];
      const promise = call3(iterator, object[key], key, object);
      if (promise === errorObj) {
        return _reject(errorObj.e);
      }
      promise && promise.then ? promise.then(_resolve, _reject) : _resolve();
    }
    function _resolve(res) {
      if (res === false) {
        callRest = 0;
        return resolve();
      }
      --rest === 0 ? resolve() : callRest-- > 0 && iterate();
    }
    function _reject(reason) {
      callRest = 0;
      reject(reason);
    }
  });
}
