'use strict';

require('..');

const assert = require('assert');

const _ = require('lodash');
const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('timesLimit', () => {

  it('should execute', async () => {

    const count = 5;
    const order = [];
    const iterator = n => {
      const delay = n % 2 === 0 ? DELAY : 3 * DELAY;
      return new Promise(resolve => setTimeout(() => {
        order.push(n);
        resolve(n * 2);
      }, delay));
    };
    const res = await Promise.timesLimit(count, 2, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.strictEqual(res.length, count);
    assert.deepStrictEqual(res, [0, 2, 4, 6, 8]);
    assert.deepStrictEqual(order, [0, 2, 1, 4, 3]);
  });

  it('should execute with synchronous function', async () => {

    const count = 5;
    const iterator = n => n * 2;
    const res = await Promise.timesLimit(count, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.strictEqual(res.length, count);
    assert.deepStrictEqual(res, [0, 2, 4, 6, 8]);
  });

  it('should execute with default concurrency which is 8', async () => {

    const order = [];
    const iterator = value => {
      order.push(value);
      return new Promise(_.noop);
    };
    Promise.timesLimit(10, iterator);
    await Promise.delay(DELAY);
    assert.deepStrictEqual(order, _.times(8));
  });

  it('should stop execution if error is caused', async () => {

    const order = [];
    const error = new Error('error');
    const iterator = async value => {
      await Promise.delay(DELAY);
      order.push(value);
      return value !== 3 ? value : Promise.reject(error);
    };
    try {
      await Promise.timesLimit(10, 2, iterator);
      assert.fail();
    } catch (e) {
      assert.strictEqual(e, error);
    }
    await Promise.delay(DELAY * 5);
    assert.deepStrictEqual(order, _.times(5));
  });

  it('should return an empty array if times is not number', async () => {

    const iterator = n => n * 2;
    const res = await Promise.timesLimit('test', 'test', iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.strictEqual(res.length, 0);
  });

  it('should return an array even if iterator is undefined', async () => {

    const res = await Promise.timesLimit(5);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.strictEqual(res.length, 5);
    assert.deepStrictEqual(res, [0, 1, 2, 3, 4]);
  });

  it('should catch a TypeError', async () => {

    const count = 5;
    const iterator = n => n.test();
    try {
      await Promise.timesLimit(count, iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});

parallel('#timesLimit', () => {

  it('should execute', async () => {

    const count = 5;
    const order = [];
    const iterator = n => {
      const delay = n % 2 === 0 ? DELAY : 3 * DELAY;
      return new Promise(resolve => setTimeout(() => {
        order.push(n);
        resolve(n * 2);
      }, delay));
    };
    const res = await Promise.resolve(count).timesLimit(2, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.strictEqual(res.length, count);
    assert.deepStrictEqual(res, [0, 2, 4, 6, 8]);
    assert.deepStrictEqual(order, [0, 2, 1, 4, 3]);
  });

  it('should execute with delay', async () => {

    const count = 5;
    const iterator = n => n * 2;
    const res = await Promise.delay(DELAY, count).timesLimit(iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.strictEqual(res.length, count);
    assert.deepStrictEqual(res, [0, 2, 4, 6, 8]);
  });
});
