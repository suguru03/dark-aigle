'use strict';

const assert = require('assert');

const parallel = require('mocha.parallel');

const aiglify = require('../../lib/aiglify');

parallel('aiglify', () => {

  it('should extend a Promise class', () => {
    class P {
      static resolve() {
      }
      static reject() {
      }
      then() {
      }
      catch() {
      }
    }
    aiglify(P);
    assert.strictEqual(typeof P.delay, 'function');
  });

});
