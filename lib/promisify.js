'use strict';

const globalSetImmediate = typeof setImmediate === 'function' ? setImmediate : {};

module.exports = Promise => {

  Promise.promisify = promisify;

  const setImmediatePromise = Promise.resolve.bind(Promise);

  /**
   * @param {Object|Function} fn
   * @param {string|number|Object} [fn]
   * @param {Object} [fn.context]
   */
  function promisify(fn, opts) {
    switch (typeof fn) {
    case 'object':
      switch (typeof opts) {
      case 'string':
      case 'number':
        if (fn[opts].__isPromisified__) {
          return fn[opts];
        }
        return makeFunctionByKey(fn, opts);
      default:
        throw new TypeError('Second argument is invalid');
      }
    case 'function':
      if (fn.__isPromisified__) {
        return fn;
      }
      switch (fn) {
      case setTimeout:
        return Promise.delay;
      case globalSetImmediate:
        return setImmediatePromise;
      }
      const ctx = opts && opts.context !== undefined ? opts.context : undefined;
      return makeFunction(fn, ctx);
    default:
      throw new TypeError('Type of first argument is not function');
    }
  }

  /**
   * @private
   * @param {Object} obj
   * @param {string} key
   */
  function makeFunctionByKey(obj, key) {

    promisified.__isPromisified__ = true;
    return promisified;

    function promisified(arg) {
      return new Promise((resolve, reject) => {
        let l = arguments.length;
        switch (l) {
        case 0:
          obj[key](callback);
          break;
        case 1:
          obj[key](arg, callback);
          break;
        default:
          const args = Array(l);
          while (l--) {
            args[l] = arguments[l];
          }
          args[args.length] = callback;
          obj[key].apply(obj, args);
          break;
        }
        function callback(err, res) {
          err ? reject(err) : resolve(res);
        }
      });
    }
  }

  /**
   * @private
   * @param {function} fn
   * @param {*} [ctx]
   */
  function makeFunction(fn, ctx) {

    promisified.__isPromisified__ = true;
    return promisified;

    function promisified(arg) {
      return new Promise((resolve, reject) => {
        let l = arguments.length;
        switch (l) {
        case 0:
          fn.call(ctx || this, callback);
          break;
        case 1:
          fn.call(ctx || this, arg, callback);
          break;
        default:
          const args = Array(l);
          while (l--) {
            args[l] = arguments[l];
          }
          args[args.length] = callback;
          fn.apply(ctx || this, args);
          break;
        }
        function callback(err, res) {
          err ? reject(err) : resolve(res);
        }
      });
    }
  }

};
