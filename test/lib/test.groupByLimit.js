'use strict';

require('..');

const assert = require('assert');

const _ = require('lodash');
const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('groupByLimit', () => {

  it('should execute', async () => {

    const order = [];
    const collection = [1, 5, 3, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.groupByLimit(collection, 2, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {
      '0': [2, 4],
      '1': [1, 3, 5]
    });
    assert.deepStrictEqual(order, [
      [0, 1],
      [2, 3],
      [1, 5],
      [4, 2],
      [3, 4]
    ]);
  });

  it('should execute with object collection', async () => {
    const order = [];
    const collection = {
      task1: 1,
      task2: 5,
      task3: 3,
      task4: 4,
      task5: 2
    };
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.groupByLimit(collection, 2, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {
      '0': [2, 4],
      '1': [1, 3, 5]
    });
    assert.deepStrictEqual(order, [
      ['task1', 1],
      ['task3', 3],
      ['task2', 5],
      ['task5', 2],
      ['task4', 4]
    ]);
  });

  it('should execute with default concurrency which is 8', async () => {

    const collection = _.times(10);
    const order = [];
    const iterator = value => {
      order.push(value);
      return new Promise(_.noop);
    };
    Promise.groupByLimit(collection, iterator);
    await Promise.delay(DELAY);
    assert.deepStrictEqual(order, _.times(8));
  });

  it('should return an empty object if collection is an empty array', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.groupByLimit([], iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {});
  });

  it('should return an empty ojbect if collection is an empty object', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.groupByLimit({}, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {});
  });

  it('should return an empty object if collection is string', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.groupByLimit('test', iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {});
  });

  it('should stop execution if error is caused', async () => {

    const order = [];
    const collection = [1, 5, 3, 4, 2];
    const error = new Error('error');
    const iterator = (value, key) => {
      return new Promise((resolve, reject) => setTimeout(() => {
        order.push([key, value]);
        value === 3 ? reject(error) : resolve(value);
      }, DELAY * value));
    };
    try {
      await Promise.groupByLimit(collection, 2, iterator);
      assert.fail();
    } catch (e) {
      assert.strictEqual(e, error);
    }
    await Promise.delay(DELAY * 5);
    assert.deepStrictEqual(order, [
      [0, 1],
      [2, 3],
      [1, 5]
    ]);
  });

  it('should stop execution if error is caused', async () => {

    const order = [];
    const collection = {
      task1: 1,
      task2: 5,
      task3: 3,
      task4: 4,
      task5: 2
    };
    const error = new Error('error');
    const iterator = (value, key) => {
      return new Promise((resolve, reject) => setTimeout(() => {
        order.push([key, value]);
        value === 3 ? reject(error) : resolve(value);
      }, DELAY * value));
    };
    try {
      await Promise.groupByLimit(collection, 2, iterator);
      assert.fail();
    } catch (e) {
      assert.strictEqual(e, error);
    }
    await Promise.delay(DELAY * 5);
    assert.deepStrictEqual(order, [
      ['task1', 1],
      ['task3', 3],
      ['task2', 5]
    ]);
  });
});

parallel('#groupByLimit', () => {

  it('should execute', async () => {

    const order = [];
    const collection = [1, 5, 3, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).groupByLimit(2, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {
      '0': [2, 4],
      '1': [1, 3, 5]
    });
    assert.deepStrictEqual(order, [
      [0, 1],
      [2, 3],
      [1, 5],
      [4, 2],
      [3, 4]
    ]);
  });

  it('should execute with object collection', async () => {
    const order = [];
    const collection = {
      task1: 1,
      task2: 5,
      task3: 3,
      task4: 4,
      task5: 2
    };
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).groupByLimit(2, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {
      '0': [2, 4],
      '1': [1, 3, 5]
    });
    assert.deepStrictEqual(order, [
      ['task1', 1],
      ['task3', 3],
      ['task2', 5],
      ['task5', 2],
      ['task4', 4]
    ]);
  });

  it('should execute with delay', async () => {

    const order = [];
    const collection = [1, 5, 3, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.delay(DELAY, collection).groupByLimit(2, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {
      '0': [2, 4],
      '1': [1, 3, 5]
    });
    assert.deepStrictEqual(order, [
      [0, 1],
      [2, 3],
      [1, 5],
      [4, 2],
      [3, 4]
    ]);
  });

  it('should execute with default concurrency which is 8', async () => {

    const collection = _.times(10);
    const order = [];
    const iterator = value => {
      order.push(value);
      return new Promise(_.noop);
    };
    Promise.resolve(collection).groupByLimit(iterator);
    await Promise.delay(DELAY * 5);
    assert.deepStrictEqual(order, _.times(8));
  });
});
