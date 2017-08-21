'use strict';

require('../..');

const assert = require('assert');

const { DELAY } = require('../config');

describe('map', () => {

  it('should work in parallel', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key, coll) => {
      assert.strictEqual(coll, collection);
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value * 2);
      }, DELAY * value));
    };
    const res = await Promise.map(collection, iterator);
    assert.deepEqual(res, [2, 8, 4]);
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
        resolve(value * 2);
      }, DELAY * value));
    };
    const res = await Promise.map(collection, iterator);
    assert.deepEqual(res, [2, 8, 4]);
    assert.deepEqual(order, [
      ['task1', 1],
      ['task3', 2],
      ['task2', 4]
    ]);
  });
});

describe('#map', () => {

  it('should execute in parallel', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key, coll) => {
      assert.strictEqual(coll, collection);
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value * 2);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).map(iterator);
    assert.deepEqual(res, [2, 8, 4]);
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
        resolve(value * 2);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).map(iterator);
    assert.deepEqual(res, [2, 8, 4]);
    assert.deepEqual(order, [
      ['task1', 1],
      ['task3', 2],
      ['task2', 4]
    ]);
  });
});
