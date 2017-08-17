'use strict';

const { errorObj, call0 } = require('./internal/util');

Promise.prototype.finally = finallyHandler;

function finallyHandler(handler) {
  return this.then(value => {
    const promise = call0(handler);
    if (promise === errorObj) {
      return Promise.reject(errorObj.e);
    }
    if (promise && promise.then) {
      return Promise.then(() => value);
    }
    return value;
  }, reason => {
    const promise = call0(handler);
    if (promise === errorObj) {
      return Promise.reject(errorObj.e);
    }
    if (promise && promise.then) {
      return Promise.then(() => Promise.reject(reason));
    }
    return Promise.reject(reason);
  });
}
