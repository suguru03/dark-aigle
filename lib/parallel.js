'use strict';

module.exports = Promise => {

  Promise.parallel = parallel;

  Promise.prototype.parallel = function parallel() {
    return this.then(Promise.parallel);
  };

  function parallel(collection) {
    return Array.isArray(collection) ? Promise.all(collection) : Promise.props(collection);
  }
};
