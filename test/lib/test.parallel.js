'use strict';

require('..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const util = require('../util');
const { DELAY } = require('../config');

parallel('parallel', () => {

  it('should execute in parallel', async () => {

    const order = [];
    const delay = util.makeDelayTask(order);
    const tasks = [
      delay('test1', DELAY * 3),
      delay('test2', DELAY * 2),
      delay('test3', DELAY * 1)
    ];
    const res = await Promise.parallel(tasks);
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

  it('should execute with object tasks in parallel', async () => {

    const order = [];
    const delay = util.makeDelayTask(order);
    const tasks = {
      task1: delay('test1', DELAY * 3),
      task2: delay('test2', DELAY * 2),
      task3: delay('test3', DELAY * 1)
    };
    const res = await Promise.parallel(tasks);
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

  it('should return an empty array immediately', async () => {

    const res = await Promise.parallel([]);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.deepStrictEqual(res, []);
  });

  it('should return an empty object immediately', async () => {

    const res = await Promise.parallel({});
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {});
  });

  it('should return an empty object immediately', async () => {

    const res = await Promise.parallel();
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepStrictEqual(res, {});
  });
});


parallel('#parallel', () => {

  it('should execute in parallel', async () => {

    const order = [];
    const delay = util.makeDelayTask(order);
    const tasks = [
      delay('test1', DELAY * 3),
      delay('test2', DELAY * 2),
      delay('test3', DELAY * 1)
    ];
    const res = await Promise.resolve(tasks).parallel();
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

  it('should execute with object tasks in parallel', async () => {

    const order = [];
    const delay = util.makeDelayTask(order);
    const tasks = {
      task1: delay('test1', DELAY * 3),
      task2: delay('test2', DELAY * 2),
      task3: delay('test3', DELAY * 1)
    };
    const res = await Promise.resolve(tasks).parallel();
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

  it('should execute with delay', async () => {

    const order = [];
    const delay = util.makeDelayTask(order);
    const tasks = [
      delay('test1', DELAY * 3),
      delay('test2', DELAY * 2),
      delay('test3', DELAY * 1)
    ];
    const res = await Promise.delay(DELAY, tasks).parallel();
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
    const delay = util.makeDelayTask(order);
    const tasks = [
      delay('test1', new Error('error1'), DELAY * 3),
      delay('test2', new Error('error2'), DELAY * 2),
      delay('test3', null, DELAY * 1)
    ];
    try {
      await Promise.resolve(tasks).parallel();
      assert.fail();
    } catch (e) {
      assert.strictEqual(e.message, 'error2');
    }
  });

});
