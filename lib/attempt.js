'use strict';

module.exports = Promise => {

  Promise.attempt = attempt;
  Promise.try = attempt;

  function attempt(handler) {
    return new Promise((resolve, reject) => {
      try {
        resolve(handler());
      } catch (e) {
        reject(e);
      }
    });
  }
};

