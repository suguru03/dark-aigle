
'use strict';

const { DEFAULT_LIMIT, errorObj, call3 } = require('./internal/util');

Promise.mapLimit = mapLimit;

function mapLimit(collection, limit, iterator) {
  if (typeof limit === 'function') {
    iterator = limit;
    limit = DEFAULT_LIMIT;
  }
  if (Array.isArray(collection)) {
    return arrayMapLimit(collection, limit, iterator);
  }
  if (collection && typeof collection === 'object') {
    return objectMapLimit(collection, limit, iterator);
  }
  return Promise.resolve([]);
}

function arrayMapLimit(array, limit, iterator) {
  const l = array.length;
  const result = Array(l);
  if (l === 0) {
    return Promise.resolve(result);
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
      const done = createCallback(i);
      promise && promise.then ? promise.then(done, _reject) : done(promise);
    }
    function createCallback(index) {
      return res => {
        result[index] = res;
        --rest === 0 ? resolve(result) : callRest-- > 0 && iterate();
      };
    }
    function _reject(reason) {
      callRest = 0;
      reject(reason);
    }
  });
}

function objectMapLimit(object, limit, iterator) {
  const keys = Object.keys(object);
  const l = keys.length;
  const result = Array(l);
  if (l === 0) {
    return Promise.resolve(result);
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
      const done = createCallback(i);
      promise && promise.then ? promise.then(done, _reject) : done(promise);
    }
    function createCallback(index) {
      return res => {
        result[index] = res;
        --rest === 0 ? resolve(result) : callRest-- > 0 && iterate();
      };
    }
    function _reject(reason) {
      callRest = 0;
      reject(reason);
    }
  });
}
