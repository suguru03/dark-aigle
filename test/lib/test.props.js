'use strict';

require('..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');
const { makeDelayTask } = require('../util');

parallel('props', () => {

  it('should execute in parallel', async () => {

    const order = [];
    const delay = makeDelayTask(order);
    const tasks = {
      task1: delay('test1', DELAY * 3),
      task2: delay('test2', DELAY * 2),
      task3: delay('test3', DELAY * 1)
    };
    const res = await Promise.props(tasks);
    assert.deepStrictEqual(res, {
      task1: 'test1',
      task2: 'test2',
      task3: 'test3'
    });
    assert.deepStrictEqual(order, [
      'test3',
      'test2',
      'test1'
    ]);
  });

  it('should catch an error', async () => {

    const order = [];
    const delay = makeDelayTask(order);
    const tasks = {
      task1: delay('test1', new Error('error1'), DELAY * 3),
      task2: delay('test2', new Error('error2'), DELAY * 2),
      task3: delay('test3', null, DELAY * 1)
    };
    try {
      await Promise.props(tasks);
      assert.fail();
    } catch (e) {
      assert.ok(e);
      assert.strictEqual(e.message, 'error2');
    }
    assert.deepStrictEqual(order, [
      'test3',
      'test2'
    ]);
  });

  it('should execute with not promise instance', async () => {

    const tasks = {
      task1: Promise.resolve(1),
      task2: 2,
      task3: 3
    };
    const res = await Promise.props(tasks);
    assert.deepStrictEqual(res, {
      task1: 1,
      task2: 2,
      task3: 3
    });
  });

  it('should return immediately', async () => {

    const res = await Promise.props({});
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {});
  });

  it('should throw an error', async () => {

    const error1 = new Error('error1');
    const error2 = new Error('error2');
    try {
      await Promise.props({
        e1: Promise.reject(error1),
        e2: Promise.reject(error2)
      });
      assert.fail();
    } catch (e) {
      assert.strictEqual(e, error1);
    }
  });
});

parallel('#props', () => {

  it('should execute in parallel', async () => {

    const order = [];
    const delay = makeDelayTask(order);
    const tasks = {
      task1: delay('test1', DELAY * 3),
      task2: delay('test2', DELAY * 2),
      task3: delay('test3', DELAY * 1)
    };
    const res = await Promise.resolve(tasks).props();
    assert.deepStrictEqual(res, {
      task1: 'test1',
      task2: 'test2',
      task3: 'test3'
    });
    assert.deepStrictEqual(order, [
      'test3',
      'test2',
      'test1'
    ]);
  });

  it('should catch an error', async () => {

    const order = [];
    const delay = makeDelayTask(order);
    const tasks = {
      task1: delay('test1', new Error('error1'), DELAY * 3),
      task2: delay('test2', new Error('error2'), DELAY * 2),
      task3: delay('test3', null, DELAY * 1)
    };
    try {
      await Promise.resolve(tasks).props();
      assert.fail();
    } catch (e) {
      assert.ok(e);
      assert.strictEqual(e.message, 'error2');
      assert.deepStrictEqual(order, [
        'test3',
        'test2'
      ]);
    }
  });

  it('should throw an error with a reject promise', async done => {

    process.on('unhandledRejection', done);
    const error = new Error('error');
    const promise = Promise.reject(error);
    promise.catch(error => assert(error));
    const tasks = {
      a: promise,
      b: promise,
      c: promise
    };
    try {
      await Promise.delay(DELAY, tasks).props();
      assert.fail();
    } catch (e) {
      assert.strictEqual(e, error);
      done();
    }
  });
});
