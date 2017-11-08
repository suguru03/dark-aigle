'use strict';

require('..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('pick', () => {

  it('should execute in parallel', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.pick(collection, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {
      '0': 1
    });
    assert.deepStrictEqual(order, [
      [0, 1],
      [2, 2],
      [1, 4]
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
    const res = await Promise.pick(collection, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {
      'task1': 1
    });
    assert.deepStrictEqual(order, [
      ['task1', 1],
      ['task3', 2],
      ['task2', 4]
    ]);
  });

  it('should return an empty array if collection is an empty array', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.pick([], iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {});
  });

  it('should return an empty array if collection is an empty object', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.pick({}, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {});
  });

  it('should return an empty array if collection is string', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.pick('test', iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {});
  });

  it('should throw TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => {
      value.test();
    };
    try {
      await Promise.pick(collection, iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});

parallel('#pick', () => {

  it('should execute in parallel', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).pick(iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {
      '0': 1
    });
    assert.deepStrictEqual(order, [
      [0, 1],
      [2, 2],
      [1, 4]
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
    const res = await Promise.resolve(collection).pick(iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {
      'task1': 1
    });
    assert.deepStrictEqual(order, [
      ['task1', 1],
      ['task3', 2],
      ['task2', 4]
    ]);
  });

  it('should execute with delay', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.delay(DELAY, collection).pick(iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {
      '0': 1
    });
    assert.deepStrictEqual(order, [
      [0, 1],
      [2, 2],
      [1, 4]
    ]);
  });

  it('should throw TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => {
      value.test();
    };
    try {
      await Promise.resolve(collection).pick(iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});
