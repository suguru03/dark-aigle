'use strict';

const skipMap = {
  constructor: true,
  arity: true,
  length: true,
  name: true,
  arguments: true,
  caller: true,
  callee: true,
  prototype: true,
  __isPromisified__: true
};
const fp = Function.prototype;
const op = Object.prototype;
const ap = Array.prototype;

module.exports = Promise => {

  Promise.promisifyAll = promisifyAll;

  /**
   * @param {Object} target
   * @param {Object} [opts]
   * @param {String} [opts.suffix=Async]
   * @param {Function} [opts.filter]
   * @param {Function} [opts.depth=2]
   */
  function promisifyAll(target, opts) {
    const { suffix = 'Async', filter = defaultFilter, depth = 2 } = opts || {};
    _promisifyAll(suffix, filter, target, undefined, undefined, depth);
    return target;
  }

  function defaultFilter(name) {
    return /^_/.test(name);
  }

  function _promisifyAll(suffix, filter, obj, key, target, depth) {
    const memo = {};
    switch (typeof obj) {
    case 'function':
      if (target) {
        const _key = `${key}${suffix}`;
        if (target[_key]) {
          if (!target[_key].__isPromisified__) {
            throw new TypeError(`Cannot promisify an API that has normal methods with '${suffix}'-suffix`);
          }
        } else {
          target[_key] = Promise.promisify(obj);
        }
      }
      iterate(suffix, filter, obj, obj, depth, memo);
      iterate(suffix, filter, obj.prototype, obj.prototype, depth, memo);
      break;
    case 'object':
      iterate(suffix, filter, obj, obj, depth, memo);
      iterate(suffix, filter, Object.getPrototypeOf(obj), obj, depth, memo);
      break;
    }
  }

  function iterate(suffix, filter, obj, target, depth, memo) {
    if (depth-- === 0 || !obj || fp === obj || op === obj || ap === obj || Object.isFrozen(obj)) {
      return;
    }
    const keys = Object.getOwnPropertyNames(obj);
    let l = keys.length;
    while (l--) {
      const key = keys[l];
      if (skipMap[key] === true || memo[key] === true || filter(key)) {
        continue;
      }
      const desc = Object.getOwnPropertyDescriptor(obj, key);
      if (!desc || desc.set || desc.get) {
        continue;
      }
      memo[key] = true;
      _promisifyAll(suffix, filter, obj[key], key, target, depth);
    }
  }
};
