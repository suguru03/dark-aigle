'use strict';

require('../..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('transformSeries', () => {

  it('should execute in series', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        result.push(value);
        resolve();
      }, DELAY * value));
    };
    const res = await Promise.transformSeries(collection, iterator, []);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.deepEqual(res, [1, 4, 2]);
    assert.deepEqual(order, [
      [0, 1],
      [1, 4],
      [2, 2]
    ]);
  });

  it('should execute on synchronous', async () => {

    const collection = [1, 4, 2];
    const iterator = (result, value) => result.push(value);
    const res = await Promise.transformSeries(collection, iterator, []);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.deepEqual(res, [1, 4, 2]);
  });

  it('should execute with object collection in series', async () => {

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
    const res = await Promise.transformSeries(collection, iterator, []);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.deepEqual(res, [1, 4, 2]);
    assert.deepEqual(order, [
      ['task1', 1],
      ['task2', 4],
      ['task3', 2]
    ]);
  });

  it('should break if value is false', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        result.push(value);
        resolve(value !== 4);
      }, DELAY * value));
    };
    const res = await Promise.transformSeries(collection, iterator, []);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.deepEqual(res, [1, 4]);
    assert.deepEqual(order, [
      [0, 1],
      [1, 4]
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
        resolve(value !== 4);
      }, DELAY * value));
    };
    const res = await Promise.transformSeries(collection, iterator, []);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.deepEqual(res, [1, 4]);
    assert.deepEqual(order, [
      ['task1', 1],
      ['task2', 4]
    ]);
  });

  it('should return an empty array if collection is an empty array', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.transformSeries([], iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.strictEqual(res.length, 0);
  });

  it('should return an empty array if collection is an empty object', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.transformSeries({}, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepEqual(res, {});
  });

  it('should return an empty array if collection is string', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.transformSeries('test', iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepEqual(res, {});
  });

  it('should catch TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => {
      value.test();
    };
    try {
      await Promise.transformSeries(collection, iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});

parallel('#transformSeries', () => {

  it('should execute in series', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        result.push(value);
        resolve();
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).transformSeries(iterator);
    assert.deepEqual(res, [1, 4, 2]);
    assert.deepEqual(order, [
      [0, 1],
      [1, 4],
      [2, 2]
    ]);
  });

  it('should execute with object collection in series', async () => {
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
    const res = await Promise.resolve(collection).transformSeries(iterator);
    assert.deepEqual(res, {
      task1: 1,
      task2: 4,
      task3: 2
    });
    assert.deepEqual(order, [
      ['task1', 1],
      ['task2', 4],
      ['task3', 2]
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
    const res = await Promise.delay(DELAY, collection).transformSeries(iterator);
    assert.deepEqual(res, [1, 4, 2]);
    assert.deepEqual(order, [
      [0, 1],
      [1, 4],
      [2, 2]
    ]);
  });

  it('should catch TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => value.test();
    try {
      await Promise.resolve(collection).transformSeries(iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });

  it('should catch an error with object collection', async () => {

    const collection = {
      task1: 1,
      task2: 4,
      task3: 2
    };
    const iterator = value => value.test();
    try {
      await Promise.resolve(collection).transformSeries(iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });

  it('should catch a TypeError with delay', async () => {

    const error = new TypeError('error');
    const iterator = () => {};
    try {
      await new Promise((resolve, reject) => setTimeout(reject, DELAY, error)).transformSeries(iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});
