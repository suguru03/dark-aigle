'use strict';

require('..');

const assert = require('assert');

const parallel = require('mocha.parallel');

parallel('whilst', () => {

  it('should execute', async () => {

    let count = 0;
    const limit = 5;
    const order = { test: [], iterator: [] };
    const test = () => {
      order.test.push(count);
      return count < limit;
    };
    const iterator = () => {
      order.iterator.push(count++);
      return new Promise(resolve => setImmediate(resolve, count));
    };
    const res = await Promise.whilst(test, iterator);
    assert.deepEqual(order.iterator, [0, 1, 2, 3, 4]);
    assert.deepEqual(order.test, [0, 1, 2, 3, 4, 5]);
    assert.strictEqual(res, 5);
  });

  it('should execute with initial value', async () => {

    const value = 1;
    const limit = 5;
    const order = { test: [], iterator: [] };
    const test = value => {
      order.test.push(value);
      return value < limit;
    };
    const iterator = value => {
      order.iterator.push(value++);
      return new Promise(resolve => setImmediate(resolve, value));
    };
    const res = await Promise.whilst(value, test, iterator);
    assert.deepEqual(order.iterator, [1, 2, 3, 4]);
    assert.deepEqual(order.test, [1, 2, 3, 4, 5]);
    assert.strictEqual(res, 5);
  });

  it('should execute with an asynchronous test case', async () => {

    let count = 0;
    const limit = 5;
    const order = { test: [], iterator: [] };
    const test = () => {
      order.test.push(count);
      return new Promise(resolve => setImmediate(resolve, count < limit));
    };
    const iterator = () => {
      order.iterator.push(count++);
      return new Promise(resolve => setImmediate(resolve, count));
    };
    const res = await Promise.whilst(test, iterator);
    assert.deepEqual(order.iterator, [0, 1, 2, 3, 4]);
    assert.deepEqual(order.test, [0, 1, 2, 3, 4, 5]);
    assert.strictEqual(res, 5);
  });

  it('should throw TypeError', async () => {

    const test = () => test.value();
    const iterator = () => new Promise(resolve => setImmediate(resolve));
    try {
      await Promise.whilst(test, iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });

  it('should throw TypeError', async () => {

    const test = () => true;
    const iterator = () => test.value();
    try {
      await Promise.whilst(test, iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});

parallel('#whilst', () => {

  it('should execute', async () => {

    const value = 1;
    const limit = 5;
    const order = { test: [], iterator: [] };
    const test = value => {
      order.test.push(value);
      return value < limit;
    };
    const iterator = value => {
      order.iterator.push(value++);
      return new Promise(resolve => setImmediate(resolve, value));
    };
    const res = await Promise.resolve(value).whilst(test, iterator);
    assert.deepEqual(order.iterator, [1, 2, 3, 4]);
    assert.deepEqual(order.test, [1, 2, 3, 4, 5]);
    assert.strictEqual(res, 5);
  });
});
