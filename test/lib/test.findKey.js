'use strict';

require('..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('findKey', () => {

  it('should execute in parallel', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.findKey(collection, iterator);
    assert.strictEqual(res, '0');
    assert.deepStrictEqual(order, [
      [0, 1]
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
    const res = await Promise.findKey(collection, iterator);
    assert.strictEqual(res, 'task1');
    assert.deepStrictEqual(order, [
      ['task1', 1]
    ]);
  });

  it('should execute in parallel', async () => {

    const order = [];
    const collection = [0, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.findKey(collection, iterator);
    assert.strictEqual(res, undefined);
    assert.deepStrictEqual(order, [
      [0, 0],
      [2, 2],
      [1, 4]
    ]);
  });

  it('should execute with object collection in parallel', async () => {

    const order = [];
    const collection = {
      task1: 0,
      task2: 4,
      task3: 2
    };
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.findKey(collection, iterator);
    assert.strictEqual(res, undefined);
    assert.deepStrictEqual(order, [
      ['task1', 0],
      ['task3', 2],
      ['task2', 4]
    ]);
  });

  it('should return undefined if collection is an empty array', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.findKey([], iterator);
    assert.strictEqual(res, undefined);
  });

  it('should return undefined if collection is an empty object', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.findKey({}, iterator);
    assert.strictEqual(res, undefined);
  });

  it('should return undefined if collection is string', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.findKey('test', iterator);
    assert.strictEqual(res, undefined);
  });

  it('should throw TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => {
      value.test();
    };
    try {
      await Promise.findKey(collection, iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});

parallel('#findKey', () => {

  it('should execute in parallel', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).findKey(iterator);
    assert.strictEqual(res, '0');
    assert.deepStrictEqual(order, [
      [0, 1]
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
    const res = await Promise.resolve(collection).findKey(iterator);
    assert.strictEqual(res, 'task1');
    assert.deepStrictEqual(order, [
      ['task1', 1]
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
    const res = await Promise.delay(DELAY, collection).findKey(iterator);
    assert.strictEqual(res, '0');
    assert.deepStrictEqual(order, [
      [0, 1]
    ]);
  });

  it('should throw TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => {
      value.test();
    };
    try {
      await Promise.resolve(collection).findKey(iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});

