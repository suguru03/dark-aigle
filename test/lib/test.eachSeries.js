'use strict';

require('..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('eachSeries', () => {

  it('should execute in series', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key, coll) => {
      assert.strictEqual(coll, collection);
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        return resolve(value);
      }, DELAY * value));
    };
    const res = await Promise.eachSeries(collection, iterator);
    assert.deepStrictEqual(res, undefined);
    assert.deepStrictEqual(order, [
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
    const iterator = (value, key, coll) => {
      assert.strictEqual(coll, collection);
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        return resolve(value);
      }, DELAY * value));
    };
    const res = await Promise.eachSeries(collection, iterator);
    assert.deepStrictEqual(res, undefined);
    assert.deepStrictEqual(order, [
      ['task1', 1],
      ['task2', 4],
      ['task3', 2]
    ]);
  });

  it('should break if value is false', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value !== 4);
      }, DELAY * value));
    };
    const res = await Promise.eachSeries(collection, iterator);
    assert.strictEqual(res, undefined);
    assert.deepStrictEqual(order, [
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
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value !== 4);
      }, DELAY * value));
    };
    const res = await Promise.eachSeries(collection, iterator);
    assert.strictEqual(res, undefined);
    assert.deepStrictEqual(order, [
      ['task1', 1],
      ['task2', 4]
    ]);
  });

  it('should return undefined if collection is an empty array', async () => {

    const iterator = value => value;
    const res = await Promise.eachSeries([], iterator);
    assert.strictEqual(res, undefined);
  });

  it('should return undefined if collection is an empty object', async () => {

    const iterator = value => value;
    const res = await Promise.eachSeries({}, iterator);
    assert.strictEqual(res, undefined);
  });

  it('should return undefined if collection is an empty string', async () => {

    const iterator = value => value;
    const res = await Promise.eachSeries('', iterator);
    assert.strictEqual(res, undefined);
  });

  it('should catch a Error', async () => {

    const collection = {
      task1: 1,
      task2: 4,
      task3: 2
    };
    const error = new Error('error');
    const iterator = value => value === 2 ? Promise.reject(error) : value;
    let err;
    try {
      await Promise.eachSeries(collection, iterator);
    } catch (e) {
      err = e;
    }
    assert.strictEqual(err, error);
  });
});

parallel('forEachSeries', () => {

  it('should execute in series', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        return resolve(value);
      }, DELAY * value));
    };
    const res = await Promise.forEachSeries(collection, iterator);
    assert.deepStrictEqual(res, undefined);
    assert.deepStrictEqual(order, [
      [0, 1],
      [1, 4],
      [2, 2]
    ]);
  });
});

parallel('#eachSeries', () => {

  it('should execute in series', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key, coll) => {
      assert.strictEqual(coll, collection);
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        return resolve(value);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).eachSeries(iterator);
    assert.deepStrictEqual(res, undefined);
    assert.deepStrictEqual(order, [
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
    const iterator = (value, key, coll) => {
      assert.strictEqual(coll, collection);
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        return resolve(value);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).eachSeries(iterator);
    assert.deepStrictEqual(res, undefined);
    assert.deepStrictEqual(order, [
      ['task1', 1],
      ['task2', 4],
      ['task3', 2]
    ]);
  });

  it('should catch a TypeError with delay', async () => {

    const error = new TypeError('error');
    const iterator = () => {};
    let err;
    try {
      await new Promise((resolve, reject) => setTimeout(reject, DELAY, error)).eachSeries(iterator);
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
    setTimeout(() => {
      promise.eachSeries(iterator)
        .then(() => assert(false))
        .catch(err => {
          assert.strictEqual(err, error);
          done();
        });
    });
  });
});

parallel('#forEachSeries', () => {

  it('should execute in series', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        return resolve(value);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).forEachSeries(iterator);
    assert.deepStrictEqual(res, undefined);
    assert.deepStrictEqual(order, [
      [0, 1],
      [1, 4],
      [2, 2]
    ]);
  });
});
