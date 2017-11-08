'use strict';

require('..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('delay', () => {

  it('should delay', async () => {
    const start = Date.now();
    await Promise.delay(DELAY);
    const diff = Date.now() - start + 1;
    assert.ok(diff >= DELAY);
  });

  it('should pass a value', async () => {
    const value = {};
    const start = Date.now();
    const res = await Promise.delay(DELAY, value);
    const diff = Date.now() - start + 1;
    assert.ok(diff >= DELAY);
    assert.strictEqual(res, value);
  });
});

parallel('#delay', () => {

  it('should delay', async () => {
    const start = Date.now();
    await Promise.resolve().delay(DELAY);
    const diff = Date.now() - start + 1;
    assert.ok(diff >= DELAY);
  });

  it('should pass a previous value', async () => {
    const value = {};
    const start = Date.now();
    const res = await Promise.resolve(value).delay(DELAY);
    const diff = Date.now() - start + 1;
    assert.ok(diff >= DELAY);
    assert.strictEqual(res, value);
  });
});
