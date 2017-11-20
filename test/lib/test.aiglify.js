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
    const P2 = aiglify(P);
    assert.strictEqual(typeof P.delay, 'function');
    assert.strictEqual(P2, P);
  });

  it.skip('should have aigle functions', () => {

    const errors = [];
    const createChecker = proto => {
      return key => {
        if (/^_/.test(key)) {
          return;
        }
        try {
          assert.ok(proto ? Promise.prototype[key] : Promise[key]);
        } catch (e) {
          errors.push(proto ? `prototype.${key}` : key);
        }
      };
    };
    Object.getOwnPropertyNames(Aigle).forEach(createChecker(false));
    Object.getOwnPropertyNames(Aigle.prototype).forEach(createChecker(true));
    if (!errors.length) {
      return;
    }
    errors.unshift('');
    assert.fail(errors.join('\n\t'));
  });
});
