'use strict';

const { DEFAULT_LIMIT, errorObj, call3 } = require('./util');

Object.assign(exports, {
  createEach,
  createEachSeries,
  createEachLimit,
  createEachWithKey,
  createEachSeriesWithKey,
  createEachLimitWithKey
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
      const done = createCallback(l, resolve);
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
      const done = createCallback(l, resolve);
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
      const done = createCallback(l, resolve, iterate);
      while (limit--) {
        iterate();
      }
      function iterate() {
        if (++i >= l) {
          return;
        }
        const promise = call3(iterator, array[i], i, array);
        if (promise === errorObj) {
          return _reject(errorObj.e);
        }
        promise && promise.then ? promise.then(done, _reject) : done();
      }
      function _reject(reason) {
        i = l;
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
      const done = createCallback(l, resolve, iterate);
      while (limit--) {
        iterate();
      }
      function iterate() {
        if (++i >= l) {
          return;
        }
        const key = keys[i];
        const promise = call3(iterator, object[key], key, object);
        if (promise === errorObj) {
          return _reject(errorObj.e);
        }
        promise && promise.then ? promise.then(done, _reject) : done();
      }
      function _reject(reason) {
        i = l;
        reject(reason);
      }
    });
  }
}

function createEachWithKey(createResult, createCallbackHandler) {

  return function(collection, iterator) {
    if (Array.isArray(collection)) {
      return callArrayEach(collection, iterator);
    }
    if (collection && typeof collection === 'object') {
      return callObjectEach(collection, iterator);
    }
    return Promise.resolve(createResult(0));
  };

  function callArrayEach(array, iterator) {
    const l = array.length;
    const result = createResult(l);
    if (l === 0) {
      return Promise.resolve(result);
    }
    return new Promise((resolve, reject) => {
      let i = -1;
      const createCallback = createCallbackHandler(l, resolve, result, array);
      while (++i < l) {
        const promise = call3(iterator, array[i], i, array);
        if (promise === errorObj) {
          return reject(errorObj.e);
        }
        const done = createCallback(i);
        promise && promise.then ? promise.then(done, reject) : done(promise);
      }
    });
  }

  function callObjectEach(object, iterator) {
    const keys = Object.keys(object);
    const l = keys.length;
    const result = createResult(l);
    if (l === 0) {
      return Promise.resolve(result);
    }
    return new Promise((resolve, reject) => {
      let i = -1;
      const createCallback = createCallbackHandler(l, resolve, result, object, keys);
      while (++i < l) {
        const key = keys[i];
        const promise = call3(iterator, object[key], key, object);
        if (promise === errorObj) {
          return reject(errorObj.e);
        }
        const done = createCallback(i);
        promise && promise.then ? promise.then(done, reject) : done(promise);
      }
    });
  }
}

function createEachSeriesWithKey(createResult, createCallbackHandler) {

  return function(collection, iterator) {
    if (Array.isArray(collection)) {
      return callArrayEach(collection, iterator);
    }
    if (collection && typeof collection === 'object') {
      return callObjectEach(collection, iterator);
    }
    return Promise.resolve(createResult(0));
  };

  function callArrayEach(array, iterator) {
    const l = array.length;
    const result = createResult(0);
    if (l === 0) {
      return Promise.resolve(result);
    }
    return new Promise((resolve, reject) => {
      let i = -1;
      const createCallback = createCallbackHandler(l, resolve, iterate, result, array);
      iterate();
      function iterate() {
        const promise = call3(iterator, array[++i], i, array);
        if (promise === errorObj) {
          return reject(errorObj.e);
        }
        const done = createCallback(i);
        promise && promise.then ? promise.then(done, reject) : done(promise);
      }
    });
  }

  function callObjectEach(object, iterator) {
    const keys = Object.keys(object);
    const l = keys.length;
    const result = createResult(0);
    if (l === 0) {
      return Promise.resolve(result);
    }
    return new Promise((resolve, reject) => {
      let i = -1;
      const createCallback = createCallbackHandler(l, resolve, iterate, result, object, keys);
      iterate();
      function iterate() {
        const key = keys[++i];
        const promise = call3(iterator, object[key], key, object);
        if (promise === errorObj) {
          return reject(errorObj.e);
        }
        const done = createCallback(i);
        promise && promise.then ? promise.then(done, reject) : done(promise);
      }
    });
  }
}

function createEachLimitWithKey(createResult, createCallbackHandler) {

  return function(collection, limit, iterator) {
    if (typeof limit === 'function') {
      iterator = limit;
      limit = DEFAULT_LIMIT;
    }
    if (Array.isArray(collection)) {
      return callArrayEach(collection, limit, iterator);
    }
    if (collection && typeof collection === 'object') {
      return callObjectEach(collection, limit, iterator);
    }
    return Promise.resolve(createResult(0));
  };

  function callArrayEach(array, limit, iterator) {
    const l = array.length;
    const result = createResult(l);
    if (l === 0) {
      return Promise.resolve(result);
    }
    return new Promise((resolve, reject) => {
      let i = -1;
      limit = limit < l ? limit : l;
      const createCallback = createCallbackHandler(l, resolve, iterate, result, array);
      while (limit--) {
        iterate();
      }
      function iterate() {
        if (++i >= l) {
          return;
        }
        const promise = call3(iterator, array[i], i, array);
        if (promise === errorObj) {
          return _reject(errorObj.e);
        }
        const done = createCallback(i);
        promise && promise.then ? promise.then(done, _reject) : done(promise);
      }
      function _reject(reason) {
        i = l;
        reject(reason);
      }
    });
  }

  function callObjectEach(object, limit, iterator) {
    const keys = Object.keys(object);
    const l = keys.length;
    const result = createResult(l);
    if (l === 0) {
      return Promise.resolve(result);
    }
    return new Promise((resolve, reject) => {
      let i = -1;
      limit = limit < l ? limit : l;
      const createCallback = createCallbackHandler(l, resolve, iterate, result, object, keys);
      while (limit--) {
        iterate();
      }
      function iterate() {
        if (++i >= l) {
          return;
        }
        const key = keys[i];
        const promise = call3(iterator, object[key], key, object);
        if (promise === errorObj) {
          return _reject(errorObj.e);
        }
        const done = createCallback(i);
        promise && promise.then ? promise.then(done, _reject) : done(promise);
      }
      function _reject(reason) {
        i = l;
        reject(reason);
      }
    });
  }
}
