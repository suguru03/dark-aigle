'use strict';

module.exports = Promise => {

  Promise.props = props;

  Promise.prototype.props = function props() {
    return this.then(Promise.props);
  };

  function props(object) {
    if (!object || typeof object !== 'object') {
      return Promise.resolve({});
    }
    const keys = Object.keys(object);
    const l = keys.length;
    if (l === 0) {
      return Promise.resolve({});
    }
    return new Promise((resolve, reject) => {
      const result = {};
      let i = -1;
      let rest = l;
      while (++i < l) {
        const key = keys[i];
        const promise = object[key];
        const done = createCallback(key);
        promise && promise.then ? promise.then(done, reject) : done(promise);
      }
      function createCallback(key) {
        return res => {
          result[key] = res;
          --rest === 0 && resolve(result);
        };
      }
    });
  }
};
