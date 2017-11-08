'use strict';

require('..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('reduce', () => {

  it('should execute in series', async () => {

    const order = [];
    const result = 'result';
    const collection = [1, 4, 2];
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(result + value);
      }, DELAY * value));
    };
    const res = await Promise.reduce(collection, iterator, result);
    assert.strictEqual(res, 'result142');
    assert.deepEqual(order, [
      [0, 1],
      [1, 4],
      [2, 2]
    ]);
  });

  it('should execute on synchronous', async () => {

    const collection = [1, 4, 2];
    const result = 'result';
    const iterator = (result, value) => result + value;
    const res = await Promise.reduce(collection, iterator, result);
    assert.strictEqual(res, 'result142');
  });

  it('should execute with object collection in series', async () => {

    const order = [];
    const result = 'result';
    const collection = {
      task1: 1,
      task2: 4,
      task3: 2
    };
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(result + value);
      }, DELAY * value));
    };
    const res = await Promise.reduce(collection, iterator, result);
    assert.strictEqual(res, 'result142');
    assert.deepEqual(order, [
      ['task1', 1],
      ['task2', 4],
      ['task3', 2]
    ]);
  });

  it('should execute with two arguments', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(result + value);
      }, DELAY * value));
    };
    const res = await Promise.reduce(collection, iterator);
    assert.strictEqual(res, 7);
    assert.deepEqual(order, [
      [1, 4],
      [2, 2]
    ]);
  });

  it('should execute with two arguments', async () => {

    const order = [];
    const collection = {
      task1: 1,
      task2: 4,
      task3: 2
    };
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(result + value);
      }, DELAY * value));
    };
    const res = await Promise.reduce(collection, iterator);
    assert.strictEqual(res, 7);
    assert.deepEqual(order, [
      ['task2', 4],
      ['task3', 2]
    ]);
  });

  it('should return result if collection is an empty array', async () => {

    const result = 'result';
    const iterator = value => value.test();
    const res = await Promise.reduce([], iterator, result);
    assert.strictEqual(res, result);
  });

  it('should return result if collection is an empty object', async () => {

    const result = 0;
    const iterator = value => value.test();
    const res = await Promise.reduce({}, iterator, result);
    assert.strictEqual(res, result);
  });

  it('should return result if collection is string', async () => {

    const result = 'result';
    const iterator = value => value.test();
    const res = await Promise.reduce('test', iterator, result);
    assert.strictEqual(res, result);
  });

  it('should throw TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => value.test();
    try {
      await Promise.reduce(collection, iterator);
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
      await Promise.reduce(collection, iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});

parallel('#reduce', () => {

  it('should execute in series', async () => {

    const order = [];
    const result = 'result';
    const collection = [1, 4, 2];
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(result + value);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).reduce(iterator, result);
    assert.strictEqual(res, 'result142');
    assert.deepEqual(order, [
      [0, 1],
      [1, 4],
      [2, 2]
    ]);
  });

  it('should execute with object collection in series', async () => {

    const order = [];
    const result = 'result';
    const collection = {
      task1: 1,
      task2: 4,
      task3: 2
    };
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(result + value);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).reduce(iterator, result);
    assert.strictEqual(res, 'result142');
    assert.deepEqual(order, [
      ['task1', 1],
      ['task2', 4],
      ['task3', 2]
    ]);
  });

  it('should execute with delay', async () => {

    const order = [];
    const result = 'result';
    const collection = [1, 4, 2];
    const iterator = (result, value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(result + value);
      }, DELAY * value));
    };
    const res = await Promise.delay(DELAY, collection).reduce(iterator, result);
    assert.strictEqual(res, 'result142');
    assert.deepEqual(order, [
      [0, 1],
      [1, 4],
      [2, 2]
    ]);
  });

  it('should throw TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => value.test();
    try {
      await Promise.resolve(collection).reduce(iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});
