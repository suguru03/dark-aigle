'use strict';

require('../..');

const assert = require('assert');

const parallel = require('mocha.parallel');

parallel('#finally', () => {

  it('should work', async () => {

    let called;
    const result = await Promise.resolve(1)
      .finally(val => {
        assert.strictEqual(val, undefined);
        called = true;
      });
    assert.ok(called);
    assert.strictEqual(result, 1);
  });

  it('should work even if an error is happened', async () => {

    let called1, called2;
    const error = new Error('error');
    try {
      await Promise.reject(error)
        .finally(val => {
          assert.strictEqual(val, undefined);
          called1 = true;
        });
    } catch(e) {
      called2 = true;
      assert.strictEqual(e, error);
    }
    assert.ok(called1);
    assert.ok(called2);
  });
});
