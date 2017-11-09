'use strict';

require('..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');
const { makeDelayTask } = require('../util');

parallel('all', () => {

  const nativePromiseAll = Promise.all.bind(Promise);
  before(() => {
    delete Promise.all;
    require('../..')(Promise);
    assert.notStrictEqual(Promise.all, nativePromiseAll);
  });

  after(() => Promise.all = nativePromiseAll);

  it('should execute on parallel', async () => {

    const order = [];
    const delay = makeDelayTask(order);
    const tasks = [
      delay('test1', DELAY * 3),
      delay('test2', DELAY * 2),
      delay('test3', DELAY * 1)
    ];
    const res = await Promise.all(tasks);
    assert.deepStrictEqual(res, [
      'test1',
      'test2',
      'test3'
    ]);
    assert.deepStrictEqual(order, [
      'test3',
      'test2',
      'test1'
    ]);
  });

  it('should catch an error', async () => {

    const order = [];
    const delay = makeDelayTask(order);
    const tasks = [
      delay('test1', new Error('error1'), DELAY * 3),
      delay('test2', new Error('error2'), DELAY * 2),
      delay('test3', null, DELAY * 1)
    ];
    try {
      await Promise.all(tasks);
      assert.fail();
    } catch (e) {
      assert.strictEqual(e.message, 'error2');
    }
    assert.deepStrictEqual(order, [
      'test3',
      'test2'
    ]);
  });

  it('should execute with instances of Promise promise', async () => {

    const tasks = [
      new Promise(resolve => resolve(1)),
      new Promise(resolve => setTimeout(() => resolve(2), 20)),
      new Promise(resolve => setTimeout(() => resolve(3), 10))
    ];
    const res = await Promise.all(tasks);
    assert.deepStrictEqual(res, [1, 2, 3]);
  });

  it('should execute with not promise instance', async () => {

    const tasks = [
      new Promise(resolve => resolve(1)),
      2,
      3
    ];
    const res = await Promise.all(tasks);
    assert.deepStrictEqual(res, [1, 2, 3]);
  });

  it('should return immediately', async () => {

    const res = await Promise.all([]);
    assert.deepStrictEqual(res, []);
  });

  it('should throw an error', async () => {

    try {
      await Promise.all([
        Promise.reject(new TypeError('error1')),
        Promise.reject(new TypeError('error2'))
      ]);
      assert.fail();
    } catch (e) {
      assert.strictEqual(e.message, 'error1');
    }
  });
});

parallel('#all', () => {

  it('should execute on parallel', async () => {

    const order = [];
    const delay = makeDelayTask(order);
    const tasks = [
      delay('test1', DELAY * 3),
      delay('test2', DELAY * 2),
      delay('test3', DELAY * 1)
    ];
    const res = await Promise.resolve(tasks).all();
    assert.deepStrictEqual(res, [
      'test1',
      'test2',
      'test3'
    ]);
    assert.deepStrictEqual(order, [
      'test3',
      'test2',
      'test1'
    ]);
  });

  it('should execute with multiple receivers on synchronous', async () => {

    const array = [1, 2, 3];
    const promise = Promise.resolve(array);
    const res = await Promise.all([
      promise.all()
      .then(value => {
        assert.deepStrictEqual(value, array);
        return 4;
      }),
      promise.all()
      .then(value => {
        assert.deepStrictEqual(value, array);
        return 5;
      }),
      promise.all()
      .then(value => {
        assert.deepStrictEqual(value, array);
        return 6;
      })
    ]);
    assert.deepStrictEqual(res, [4, 5, 6]);
  });

  it('should execute with multiple receivers on asynchronous', async () => {

    const array = [1, 2, 3];
    const promise = new Promise(resolve => setImmediate(resolve, array));
    const res = await Promise.all([
      promise.all()
      .then(value => {
        assert.deepStrictEqual(value, array);
        return 4;
      }),
      promise.all()
      .then(value => {
        assert.deepStrictEqual(value, array);
        return 5;
      }),
      promise.all()
      .then(value => {
        assert.deepStrictEqual(value, array);
        return 6;
      })
    ]);
    assert.deepStrictEqual(res, [4, 5, 6]);
  });

  it('should catch error with multiple receivers on asynchronous', async () => {

    const error = new TypeError('error');
    const promise = new Promise((resolve, reject) => setImmediate(reject, error));
    try {
      await Promise.all([
        promise.all(),
        promise.all(),
        promise.all()
      ]);
      assert.fail();
    } catch (e) {
      assert.strictEqual(e, error);
    }
  });

  it('should catch an error', async () => {

    const order = [];
    const delay = makeDelayTask(order);
    const tasks = [
      delay('test1', new Error('error1'), DELAY * 3),
      delay('test2', new Error('error2'), DELAY * 2),
      delay('test3', null, DELAY * 1)
    ];
    try {
      await Promise.resolve(tasks).all();
      assert.fail();
    } catch (e){
      assert.strictEqual(e.message, 'error2');
    }
    assert.deepStrictEqual(order, [
      'test3',
      'test2'
    ]);
  });
});
