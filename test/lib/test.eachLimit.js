'use strict';

require('..');

const assert = require('assert');

const _ = require('lodash');
const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('eachLimit', () => {

  it('should execute', async () => {

    const order = [];
    const collection = [1, 5, 3, 4, 2];
    const iterator = (value, key, coll) => {
      assert.strictEqual(coll, collection);
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value);
      }, DELAY * value));
    };
    const res = await Promise.eachLimit(collection, 2, iterator);
    assert.deepStrictEqual(res, undefined);
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
    const iterator = (value, key, coll) => {
      assert.strictEqual(coll, collection);
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value);
      }, DELAY * value));
    };
    const res = await Promise.eachLimit(collection, 2, iterator);
    assert.deepStrictEqual(res, undefined);
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
    Promise.eachLimit(collection, iterator);
    await new Promise(resolve => setTimeout(resolve, DELAY));
    assert.deepStrictEqual(order, _.times(8));
  });

  it('should break if value is false', async () => {

    const order = [];
    const collection = [1, 5, 3, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value !== 5);
      }, DELAY * value));
    };
    const res = await Promise.eachLimit(collection, 2, iterator);
    await Promise.delay(DELAY);
    assert.deepStrictEqual(res, undefined);
    assert.deepStrictEqual(order, [
      [0, 1],
      [2, 3],
      [1, 5]
    ]);
  });

  it('should break if value is false', async () => {
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
        resolve(value !== 5);
      }, DELAY * value));
    };
    const res = await Promise.eachLimit(collection, 2, iterator);
    await Promise.delay(DELAY);
    assert.deepStrictEqual(res, undefined);
    assert.deepStrictEqual(order, [
      ['task1', 1],
      ['task3', 3],
      ['task2', 5]
    ]);
  });

  it('should stop execution if error is caused', async () => {

    const order = [];
    const collection = [1, 5, 3, 4, 2];
    const iterator = (value, key) => {
      return new Promise((resolve, reject) => setTimeout(() => {
        order.push([key, value]);
        value === 3 ? reject('error') : resolve(value);
      }, DELAY * value));
    };
    try {
      await Promise.eachLimit(collection, 2, iterator);
      assert.fail();
    } catch (e) {
      assert.strictEqual(e, 'error');
    }
    await Promise.delay(DELAY);
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
    const iterator = (value, key) => {
      return new Promise((resolve, reject) => setTimeout(() => {
        order.push([key, value]);
        value === 3 ? reject('error') : resolve(value);
      }, DELAY * value));
    };
    try {
      await Promise.eachLimit(collection, 2, iterator);
      assert.fail();
    } catch (e) {
      assert.deepStrictEqual(e, 'error');
    }
    await Promise.delay(DELAY);
    assert.deepStrictEqual(order, [
      ['task1', 1],
      ['task3', 3],
      ['task2', 5]
    ]);
  });

  it('should return undefined if collection is an empty array', async () => {

    const iterator = value => value;
    const res = await Promise.eachLimit([], iterator);
    assert.strictEqual(res, undefined);
  });

  it('should return undefined if collection is an empty object', async () => {

    const iterator = value => value;
    const res = await Promise.eachLimit({}, iterator);
    assert.strictEqual(res, undefined);
  });

  it('should return undefined if collection is an empty string', async () => {

    const iterator = value => value;
    const res = await Promise.eachLimit('', iterator);
    assert.strictEqual(res, undefined);
  });
});

parallel('forEachLimit', () => {

  it('should execute', async () => {

    const order = [];
    const collection = [1, 5, 3, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value);
      }, DELAY * value));
    };
    const res = await Promise.forEachLimit(collection, 2, iterator);
    assert.deepStrictEqual(res, undefined);
    assert.deepStrictEqual(order, [
      [0, 1],
      [2, 3],
      [1, 5],
      [4, 2],
      [3, 4]
    ]);
  });
});

parallel('#eachLimit', () => {

  it('should execute', async () => {

    const order = [];
    const collection = [1, 5, 3, 4, 2];
    const iterator = (value, key, coll) => {
      assert.strictEqual(coll, collection);
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).eachLimit(2, iterator);
    assert.deepStrictEqual(res, undefined);
    assert.deepStrictEqual(order, [
      [0, 1],
      [2, 3],
      [1, 5],
      [4, 2],
      [3, 4]
    ]);
  });

  it('should execute on synchronous', async () => {

    const order = [];
    const collection = [1, 5, 3, 4, 2];
    const iterator = (value, key) => order.push([key, value]);
    const res = await Promise.resolve(collection).eachLimit(2, iterator);
    assert.deepStrictEqual(res, undefined);
    assert.deepStrictEqual(order, [
      [0, 1],
      [1, 5],
      [2, 3],
      [3, 4],
      [4, 2]
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
    const iterator = (value, key, coll) => {
      assert.strictEqual(coll, collection);
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).eachLimit(2, iterator);
    assert.deepStrictEqual(res, undefined);
    assert.deepStrictEqual(order, [
      ['task1', 1],
      ['task3', 3],
      ['task2', 5],
      ['task5', 2],
      ['task4', 4]
    ]);
  });

  it('should catch a TypeError with delay', async () => {

    const error = new TypeError('error');
    const iterator = () => {};
    let err;
    try {
      await new Promise((resolve, reject) => setTimeout(reject, DELAY, error)).eachLimit(iterator);
    } catch (e) {
      err = e;
    }
    assert.strictEqual(err, error);
  });

  it('should not call each function if the parent promise is rejected', done => {

    process.on('unhandledRejection', done);
    const error = new Error('error');
    const promise = Promise.reject(error);
    promise.catch(error => assert(error));
    const iterator = () => promise;
    setTimeout(async () => {
      try {
        await promise.eachLimit(iterator);
      } catch (e) {
        assert.strictEqual(e, error);
        done();
      }
    });
  });
});

parallel('#forEachLimit', () => {

  it('should execute', async () => {

    const order = [];
    const collection = [1, 5, 3, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).forEachLimit(2, iterator);
    assert.deepStrictEqual(res, undefined);
    assert.deepStrictEqual(order, [
      [0, 1],
      [2, 3],
      [1, 5],
      [4, 2],
      [3, 4]
    ]);
  });
});
