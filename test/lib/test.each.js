'use strict';

require('..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('each', () => {

  it('should work in parallel', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key, coll) => {
      assert.strictEqual(coll, collection);
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value);
      }, DELAY * value));
    };
    const res = await Promise.each(collection, iterator);
    assert.strictEqual(res, undefined);
    assert.deepEqual(order, [
      [0, 1],
      [2, 2],
      [1, 4]
    ]);
  });

  it('should work with object', async () => {

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
        resolve(value);
      }, DELAY * value));
    };
    const res = await Promise.each(collection, iterator);
    assert.strictEqual(res, undefined);
    assert.deepEqual(order, [
      ['task1', 1],
      ['task3', 2],
      ['task2', 4]
    ]);
  });

  it('should break if value is false', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value !== 2);
      }, DELAY * value));
    };
    const res = await Promise.each(collection, iterator);
    assert.strictEqual(res, undefined);
    assert.deepEqual(order, [
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
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value !== 2);
      }, DELAY * value));
    };
    const res = await Promise.each(collection, iterator);
    assert.strictEqual(res, undefined);
    assert.deepEqual(order, [
      ['task1', 1],
      ['task3', 2]
    ]);
  });

  it('should return undefined if collection is an empty array', async () => {

    const iterator = value => value;
    const res = await Promise.each([], iterator);
    assert.strictEqual(res, undefined);
  });

  it('should return undefined if collection is an empty object', async () => {

    const iterator = value => value;
    const res = await Promise.each({}, iterator);
    assert.strictEqual(res, undefined);
  });

  it('should return undefined if collection is an empty string', async () => {

    const iterator = value => value;
    const res = await Promise.each('', iterator);
    assert.strictEqual(res, undefined);
  });

  it('should throw TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => {
      value.test();
    };
    let error;
    try {
      await Promise.each(collection, iterator);
    } catch (e) {
      error = e;
    }
    assert.ok(error);
    assert.ok(error instanceof TypeError);
  });

  it('should throw TypeError', async () => {

    const collection = {
      task1: 1,
      task2: 4,
      task3: 2
    };
    const iterator = value => value.test();
    let error;
    try {
      await Promise.each(collection, iterator);
    } catch (e) {
      error = e;
    }
    assert.ok(error);
    assert.ok(error instanceof TypeError);
  });

  it('should throw error if iterator returns an error promise', async done => {

    process.on('unhandledRejection', done);
    const promise = Promise.reject(1);
    const collection = [1, 4, 2];
    const iterator = () => promise;
    let error;
    try {
      await Promise.each(collection, iterator);
    } catch (e) {
      error = e;
    }
    assert(error);
    done();
  });
});

parallel('forEach', () => {

  it('should execute in parallel', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value);
      }, DELAY * value));
    };
    const res = await Promise.forEach(collection, iterator);
    assert.strictEqual(res, undefined);
    assert.deepEqual(order, [
      [0, 1],
      [2, 2],
      [1, 4]
    ]);
  });
});


parallel('#each', () => {

  it('should execute in parallel', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key, coll) => {
      assert.strictEqual(coll, collection);
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).each(iterator);
    assert.strictEqual(res, undefined);
    assert.deepEqual(order, [
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
    const iterator = (value, key, coll) => {
      assert.strictEqual(coll, collection);
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).each(iterator);
    assert.strictEqual(res, undefined);
    assert.deepEqual(order, [
      ['task1', 1],
      ['task3', 2],
      ['task2', 4]
    ]);
  });

  it('should extends a returning async/await promise', async () => {

    async function test() {
      return [1, 4, 2];
    }
    const order = [];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value);
      }, DELAY * value));
    };
    const res = await test().each(iterator);
    assert.strictEqual(res, undefined);
    assert.deepEqual(order, [
      [0, 1],
      [2, 2],
      [1, 4]
    ]);
  });

  it('should catch a TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => {
      value.test();
    };
    let error;
    try {
      await Promise.resolve(collection).each(iterator);
    } catch (e) {
      error = e;
    }
    assert.ok(error);
    assert.ok(error instanceof TypeError);
  });

  it('should catch a TypeError with delay', async () => {

    const error = new TypeError('error');
    const iterator = () => {};
    let err;
    try {
      await new Promise((resolve, reject) => setTimeout(reject, DELAY, error)).each(iterator);
    } catch (e) {
      err = e;
    }
    assert.strictEqual(err, error);
  });
});

parallel('#forEach', () => {

  it('should execute in parallel', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).forEach(iterator);
    assert.strictEqual(res, undefined);
    assert.deepEqual(order, [
      [0, 1],
      [2, 2],
      [1, 4]
    ]);
  });
});
