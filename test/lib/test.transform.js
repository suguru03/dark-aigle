'use strict';

require('..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('transform', () => {

  it('should execute in parallel', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        result.push(value);
        resolve();
      }, DELAY * value));
    };
    const res = await Promise.transform(collection, iterator, []);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.deepStrictEqual(res, [1, 2, 4]);
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
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        result.push(value);
        resolve();
      }, DELAY * value));
    };
    const res = await Promise.transform(collection, iterator, []);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.deepStrictEqual(res, [1, 2, 4]);
    assert.deepStrictEqual(order, [
      ['task1', 1],
      ['task3', 2],
      ['task2', 4]
    ]);
  });

  it('should execute without accumulator', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        result.push(value);
        resolve();
      }, DELAY * value));
    };
    const res = await Promise.transform(collection, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.deepStrictEqual(res, [1, 2, 4]);
    assert.deepStrictEqual(order, [
      [0, 1],
      [2, 2],
      [1, 4]
    ]);
  });

  it('should execute with object collection witout accumulator', async () => {

    const order = [];
    const collection = {
      task1: 1,
      task2: 4,
      task3: 2
    };
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        result[key] = value;
        resolve();
      }, DELAY * value));
    };
    const res = await Promise.transform(collection, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {
      'task1': 1,
      'task2': 4,
      'task3': 2
    });
    assert.deepStrictEqual(order, [
      ['task1', 1],
      ['task3', 2],
      ['task2', 4]
    ]);
  });

  it('should break if value is false', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        result.push(value);
        resolve(value !== 2);
      }, DELAY * value));
    };
    const res = await Promise.transform(collection, iterator, []);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.deepStrictEqual(res, [1, 2]);
    assert.deepStrictEqual(order, [
      [0, 1],
      [2, 2]
    ]);
  });

  it('should break if value is false', async () => {

    const order = [];
    const collection = {
      task1: 1,
      task2: 4,
      task3: 2
    };
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        result.push(value);
        resolve(value !== 2);
      }, DELAY * value));
    };
    const res = await Promise.transform(collection, iterator, []);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.deepStrictEqual(res, [1, 2]);
    assert.deepStrictEqual(order, [
      ['task1', 1],
      ['task3', 2]
    ]);
  });

  it('should return an empty array if collection is an empty array', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.transform([], iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.strictEqual(res.length, 0);
  });

  it('should return an empty object if collection is an empty object', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.transform({}, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {});
  });

  it('should return an empty array if collection is string', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.transform('test', iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {});
  });

  it('should throw TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => value.test();
    try {
      await Promise.transform(collection, iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });

  it('should throw TypeError', async () => {

    const collection = {
      task1: 1,
      task2: 4,
      task3: 2
    };
    const iterator = value => value.test();
    try {
      await Promise.transform(collection, iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});

parallel('#transform', () => {

  it('should execute in parallel', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        result.push(value);
        resolve();
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).transform(iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.deepStrictEqual(res, [1, 2, 4]);
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
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        result[key] = value;
        resolve();
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).transform(iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {
      'task1': 1,
      'task2': 4,
      'task3': 2
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
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        result.push(value);
        resolve();
      }, DELAY * value));
    };
    const res = await Promise.delay(DELAY, collection).transform(iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.deepStrictEqual(res, [1, 2, 4]);
    assert.deepStrictEqual(order, [
      [0, 1],
      [2, 2],
      [1, 4]
    ]);
  });

  it('should catch a TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => value.test();
    try {
      await Promise.resolve(collection).transform(iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });

  it('should catch a TypeError with delay', async () => {

    const error = new TypeError('error');
    const iterator = () => {};
    try {
      await new Promise((resolve, reject) => setTimeout(reject, DELAY, error)).transform(iterator);
      assert.fail();
    } catch (e) {
      assert.strictEqual(e, error);
    }
  });
});
