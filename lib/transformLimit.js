'use strict';

const { DEFAULT_LIMIT, errorObj, call4 } = require('./internal/util');

Promise.transformLimit = transformLimit;

function transformLimit(collection, limit, iterator, result) {
  if (typeof limit === 'function') {
    result = iterator;
    iterator = limit;
    limit = DEFAULT_LIMIT;
  }
  if (Array.isArray(collection)) {
    return callArrayEach(collection, limit, iterator, result || []);
  }
  if (collection && typeof collection === 'object') {
    return callObjectEach(collection, limit, iterator, result || {});
  }
  return Promise.resolve(result || {});
}

function callArrayEach(array, limit, iterator, result) {
  const l = array.length;
  if (l === 0) {
    return Promise.resolve(result);
  }
  return new Promise((resolve, reject) => {
    let i = -1;
    let rest = l;
    limit = limit < l ? limit : l;
    while (limit--) {
      iterate();
    }
    function iterate() {
      if (++i >= l) {
        return;
      }
      const promise = call4(iterator, result, array[i], i, array);
      if (promise === errorObj) {
        return _reject(errorObj.e);
      }
      promise && promise.then ? promise.then(done, _reject) : done();
    }
    function done(bool) {
      (bool === false || --rest === 0) ? resolve(result) : iterate();
    }
    function _reject(reason) {
      i = l;
      reject(reason);
    }
  });
}

function callObjectEach(object, limit, iterator, result) {
  const keys = Object.keys(object);
  const l = keys.length;
  if (l === 0) {
    return Promise.resolve(result);
  }
  return new Promise((resolve, reject) => {
    let i = -1;
    let rest = l;
    limit = limit < l ? limit : l;
    while (limit--) {
      iterate();
    }
    function iterate() {
      if (++i >= l) {
        return;
      }
      const key = keys[i];
      const promise = call4(iterator, result, object[key], key, object);
      if (promise === errorObj) {
        return _reject(errorObj.e);
      }
      promise && promise.then ? promise.then(done, _reject) : done();
    }
    function done(bool) {
      (bool === false || --rest === 0) ? resolve(result) : iterate();
    }
    function _reject(reason) {
      i = l;
      reject(reason);
    }
  });
}
