'use strict';

require('..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('someSeries', () => {

  it('should execute in series', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.someSeries(collection, iterator);
    assert.strictEqual(res, true);
    assert.deepStrictEqual(order, [
      [0, 1]
    ]);
  });

  it('should execute on synchronous', async () => {

    const collection = [1, 4, 2];
    const iterator = value => value % 2;
    const res = await Promise.someSeries(collection, iterator);
    assert.strictEqual(res, true);
  });

  it('should execute with object collection in series', async () => {

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
    const res = await Promise.someSeries(collection, iterator);
    assert.strictEqual(res, true);
    assert.deepStrictEqual(order, [
      ['task1', 1]
    ]);
  });

  it('should execute in series', async () => {

    const order = [];
    const collection = [0, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.someSeries(collection, iterator);
    assert.strictEqual(res, false);
    assert.deepStrictEqual(order, [
      [0, 0],
      [1, 4],
      [2, 2]
    ]);
  });

  it('should execute with object collection in series', async () => {

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
    const res = await Promise.someSeries(collection, iterator);
    assert.strictEqual(res, false);
    assert.deepStrictEqual(order, [
      ['task1', 0],
      ['task2', 4],
      ['task3', 2]
    ]);
  });

  it('should return an empty array if collection is an empty array', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.someSeries([], iterator);
    assert.strictEqual(res, false);
  });

  it('should return an empty array if collection is an empty object', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.someSeries({}, iterator);
    assert.strictEqual(res, false);
  });

  it('should return an empty array if collection is string', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.someSeries('test', iterator);
    assert.strictEqual(res, false);
  });
  it('should throw TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => {
      value.test();
    };
    try {
      await Promise.someSeries(collection, iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});

parallel('#someSeries', () => {

  it('should execute in series', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).someSeries(iterator);
    assert.strictEqual(res, true);
    assert.deepStrictEqual(order, [
      [0, 1]
    ]);
  });

  it('should execute with object collection in series', async () => {
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
    const res = await Promise.resolve(collection).someSeries(iterator);
    assert.strictEqual(res, true);
    assert.deepStrictEqual(order, [
      ['task1', 1]
    ]);
  });

  it('should execute with delayk', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.delay(DELAY, collection).someSeries(iterator);
    assert.strictEqual(res, true);
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
      await Promise.resolve(collection).someSeries(iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});
