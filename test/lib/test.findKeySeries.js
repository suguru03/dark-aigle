'use strict';

require('..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('findKeySeries', async () => {

  it('should execute in series', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.findKeySeries(collection, iterator);
    assert.strictEqual(res, '0');
    assert.deepStrictEqual(order, [
      [0, 1]
    ]);
  });

  it('should execute on synchronous', async () => {

    const collection = [1, 4, 2];
    const iterator = value => value % 2;
    const res = await Promise.findKeySeries(collection, iterator);
    assert.strictEqual(res, '0');
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
    const res = await Promise.findKeySeries(collection, iterator);
    assert.strictEqual(res, 'task1');
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
    const res = await Promise.findKeySeries(collection, iterator);
    assert.strictEqual(res, undefined);
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
    const res = await Promise.findKeySeries(collection, iterator);
    assert.strictEqual(res, undefined);
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
    const res = await Promise.findKeySeries([], iterator);
    assert.strictEqual(res, undefined);
  });

  it('should return an empty array if collection is an empty object', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.findKeySeries({}, iterator);
    assert.strictEqual(res, undefined);
  });

  it('should return an empty array if collection is string', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.findKeySeries('test', iterator);
    assert.strictEqual(res, undefined);
  });
  it('should throw TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => {
      value.test();
    };
    try {
      await Promise.findKeySeries(collection, iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});

parallel('#findKeySeries', async () => {

  it('should execute in series', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value % 2);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).findKeySeries(iterator);
    assert.strictEqual(res, '0');
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
    const res = await Promise.resolve(collection).findKeySeries(iterator);
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
    const res = await Promise.delay(DELAY, collection).findKeySeries(iterator);
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
      await Promise.resolve(collection).findKeySeries(iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});
