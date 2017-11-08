'use strict';

require('..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('every', () => {

  it('should execute in parallel', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key, coll) => {
      assert.strictEqual(coll, collection);
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.every(collection, iterator);
    assert.strictEqual(res, false);
    assert.deepEqual(order, [
      [0, 1],
      [2, 2]
    ]);
  });

  it('should execute with object collection in parallel', async () => {

    const order = [];
    const collection = {
      task1: 1,
      task2: 4,
      task3: 2
    };
    const iterator = (value, key, coll) => {
      assert.strictEqual(coll, collection);
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.every(collection, iterator);
    assert.strictEqual(res, false);
    assert.deepEqual(order, [
      ['task1', 1],
      ['task3', 2]
    ]);
  });

  it('should execute in parallel', async () => {

    const order = [];
    const collection = [1, 5, 3];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.every(collection, iterator);
    assert.strictEqual(res, true);
    assert.deepEqual(order, [
      [0, 1],
      [2, 3],
      [1, 5]
    ]);
  });

  it('should execute with object collection in parallel', async () => {

    const order = [];
    const collection = {
      task1: 1,
      task2: 5,
      task3: 3
    };
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.every(collection, iterator);
    assert.strictEqual(res, true);
    assert.deepEqual(order, [
      ['task1', 1],
      ['task3', 3],
      ['task2', 5]
    ]);
  });

  it('should return true if collection is an empty array', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.every([], iterator);
    assert.strictEqual(res, true);
  });

  it('should return true if collection is an empty object', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.every({}, iterator);
    assert.strictEqual(res, true);
  });

  it('should return true if collection is string', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.every('test', iterator);
    assert.strictEqual(res, true);
  });

  it('should throw TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => {
      value.test();
    };
    try {
      await Promise.every(collection, iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});

parallel('#every', () => {

  it('should execute in parallel', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).every(iterator);
    assert.strictEqual(res, false);
    assert.deepEqual(order, [
      [0, 1],
      [2, 2]
    ]);
  });

  it('should execute with object collection in parallel', async () => {
    const order = [];
    const collection = {
      task1: 1,
      task2: 4,
      task3: 2
    };
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).every(iterator);
    assert.strictEqual(res, false);
    assert.deepEqual(order, [
      ['task1', 1],
      ['task3', 2]
    ]);
  });

  it('should execute in parallel with delay', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.delay(DELAY, collection).every(iterator);
    assert.strictEqual(res, false);
    assert.deepEqual(order, [
      [0, 1],
      [2, 2]
    ]);
  });

  it('should throw TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => {
      value.test();
    };
    try {
      await Promise.resolve(collection).every(iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});

