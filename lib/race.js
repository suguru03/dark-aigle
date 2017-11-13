'use strict';

module.exports = Promise => {

  const callArrayRace = Promise.race ? Promise.race.bind(Promise) : callArrayEach;
  Promise.race = race;

  Promise.prototype.race = function race() {
    return this.then(Promise.race);
  };

  function race(collection) {
    if (Array.isArray(collection)) {
      return callArrayRace(collection);
    }
    if (collection && typeof collection === 'object') {
      return callObjectEach(collection);
    }
    return new Promise(() => {});
  }

  function callArrayEach(array) {
    const l = array.length;
    return new Promise((resolve, reject) => {
      let i = -1;
      while (++i < l) {
        const promise = array[i];
        promise && promise.then ? promise.then(resolve, reject) : resolve(promise);
      }
    });
  }

  function callObjectEach(object) {
    const keys = Object.keys(object);
    const l = keys.length;
    return new Promise((resolve, reject) => {
      let i = -1;
      while (++i < l) {
        const promise = object[keys[i]];
        promise && promise.then ? promise.then(resolve, reject) : resolve(promise);
      }
    });
  }
};
