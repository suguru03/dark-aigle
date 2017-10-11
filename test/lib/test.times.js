'use strict';

require('../..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('times', () => {

  it('should execute', async () => {

    const count = 5;
    const order = [];
    const iterator = n => {
      const delay = n % 2 ? (n + 5) * DELAY : (n + 1) * DELAY;
      return new Promise(resolve => {
        setTimeout(() => {
          order.push(n);
          resolve(n * 2);
        }, delay);
      });
    };
    const res = await Promise.times(count, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.strictEqual(res.length, count);
    assert.deepEqual(res, [0, 2, 4, 6, 8]);
    assert.deepEqual(order, [0, 2, 4, 1, 3]);
  });

  it('should execute with synchronous function', async () => {

    const count = 5;
    const iterator = n => n * 2;
    const res = await Promise.times(count, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.strictEqual(res.length, count);
    assert.deepEqual(res, [0, 2, 4, 6, 8]);
  });

  it('should return an empty array if times is not number', async () => {

    const iterator = n => n * 2;
    const res = await Promise.times('test', iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.strictEqual(res.length, 0);
  });

  it('should return an array even if iterator is undefined', async () => {

    const res = await Promise.times(5);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.strictEqual(res.length, 5);
    assert.deepEqual(res, [0, 1, 2, 3, 4]);
  });

  it('should execute with decimal number', async () => {

    const res = await Promise.times(5.5);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.strictEqual(res.length, 5);
    assert.deepEqual(res, [0, 1, 2, 3, 4]);
  });

  it('should catch a TypeError', async () => {

    const iterator = n => n();
    try {
      await Promise.times(10, iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});

parallel('#times', () => {

  it('should execute', async () => {

    const count = 5;
    const order = [];
    const iterator = n => {
      const delay = n % 2 ? (n + 5) * DELAY : (n + 1) * DELAY;
      return new Promise(resolve => {
        setTimeout(() => {
          order.push(n);
          resolve(n * 2);
        }, delay);
      });
    };
    const res = await Promise.resolve(count).times(iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.strictEqual(res.length, count);
    assert.deepEqual(res, [0, 2, 4, 6, 8]);
    assert.deepEqual(order, [0, 2, 4, 1, 3]);
  });

  it('should execute with delay', async () => {

    const count = 5;
    const iterator = n => n * 2;
    const res = await Promise.delay(DELAY, count).times(iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.strictEqual(res.length, count);
    assert.deepEqual(res, [0, 2, 4, 6, 8]);
  });
});
