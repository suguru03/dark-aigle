'use strict';

require('../..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('groupBySeries', () => {

  it('should execute in series', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.groupBySeries(collection, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepEqual(res, {
      '0': [4, 2],
      '1': [1]
    });
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
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.groupBySeries(collection, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepEqual(res, {
      '0': [4, 2],
      '1': [1]
    });
    assert.deepEqual(order, [
      ['task1', 1],
      ['task2', 4],
      ['task3', 2]
    ]);
  });

  it('should return an empty object if collection is an empty array', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.groupBySeries([], iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepEqual(res, {});
  });

  it('should return an empty ojbect if collection is an empty object', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.groupBySeries({}, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepEqual(res, {});
  });

  it('should return an empty object if collection is string', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.groupBySeries('test', iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepEqual(res, {});
  });
  it('should throw TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => {
      value.test();
    };
    try {
      await Promise.groupBySeries(collection, iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});

parallel('#groupBySeries', () => {

  it('should execute in series', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).groupBySeries(iterator);
    assert.deepEqual(res, {
      '0': [4, 2],
      '1': [1]
    });
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
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).groupBySeries(iterator);
    assert.deepEqual(res, {
      '0': [4, 2],
      '1': [1]
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
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.delay(DELAY, collection).groupBySeries(iterator);
    assert.deepEqual(res, {
      '0': [4, 2],
      '1': [1]
    });
    assert.deepEqual(order, [
      [0, 1],
      [1, 4],
      [2, 2]
    ]);
  });

  it('should throw TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => {
      value.test();
    };
    try {
      await Promise.resolve(collection).groupBySeries(iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});

