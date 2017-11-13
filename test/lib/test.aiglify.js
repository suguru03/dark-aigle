'use strict';

require('..');

const assert = require('assert');

const Aigle = require('aigle');
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

  it.skip('should have aigle functions', () => {

    const errors = [];
    Object.getOwnPropertyNames(Aigle)
      .sort()
      .forEach(key => {
        try {
          assert.ok(Promise[key]);
        } catch (e) {
          errors.push(key);
        }
      });
    if (!errors.length) {
      return;
    }
    errors.unshift('');
    assert.fail(errors.join('\n\t'));
  });

});
