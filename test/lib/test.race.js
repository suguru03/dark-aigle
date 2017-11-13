'use strict';

require('..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');
const { makeDelayTask } = require('../util');

parallel('race', () => {

  it('should execute', async () => {

    const order = [];
    const delay = makeDelayTask(order);
    const tasks = [
      delay('test1', DELAY * 3),
      delay('test2', DELAY * 2),
      delay('test3', DELAY * 1)
    ];
    const res = await Promise.race(tasks);
    assert.strictEqual(res, 'test3');
    assert.deepStrictEqual(order, ['test3']);
  });

  it('should execute with object tasks', async () => {
    const order = [];
    const delay = makeDelayTask(order);
    const tasks = {
      task1: delay('test1', DELAY * 3),
      task2: delay('test2', DELAY * 2),
      task3: delay('test3', DELAY * 1)
    };
    const res = await Promise.race(tasks);
    assert.strictEqual(res, 'test3');
    assert.deepStrictEqual(order, ['test3']);
  });

  it('should catch an error', async () => {

    const order = [];
    const delay = makeDelayTask(order);
    const tasks = [
      delay('test1', new Error('error1'), DELAY * 3),
      delay('test2', null, DELAY * 2),
      delay('test3', new Error('error3'), DELAY * 1)
    ];
    try {
      await Promise.race(tasks);
      assert.fail();
    } catch (e) {
      assert.strictEqual(e.message, 'error3');
    }
    assert.deepStrictEqual(order, ['test3']);
  });

  it('should catch an error', async () => {

    const order = [];
    const delay = makeDelayTask(order);
    const tasks = {
      task1: delay('test1', new Error('error1'), DELAY * 3),
      task2: delay('test2', null, DELAY * 2),
      task3: delay('test3', new Error('error3'), DELAY * 1)
    };
    try {
      await Promise.race(tasks);
      assert.fail();
    } catch (e) {
      assert.strictEqual(e.message, 'error3');
    }
    assert.deepStrictEqual(order, ['test3']);
  });

  it('should be pending if tasks is an empty array', async () => {

    let called = false;
    Promise.race([])
      .then(() => called = true);
    await Promise.delay(DELAY);
    assert.strictEqual(called, false);
  });

  it('should be pending if tasks is an empty object', async () => {

    let called = false;
    Promise.race({})
      .then(() => called = true);
    await Promise.delay(DELAY);
    assert.strictEqual(called, false);
  });

  it('should return undefined if tasks is empty', async () => {

    let called = false;
    Promise.race()
      .then(() => called = true);
    await Promise.delay(DELAY);
    assert.strictEqual(called, false);
  });

  it('should return a resolved promise', async () => {
    const res = await Promise.race([
      Promise.race(),
      Promise.resolve(1),
      2
    ]);
    assert.strictEqual(res, 1);
  });

  it('should return a value', async () => {
    const res = await Promise.race([
      Promise.race(),
      1,
      Promise.resolve(2)
    ]);
    assert.strictEqual(res, 1);
  });
});


parallel('#race', () => {

  it('should execute', async () => {

    const order = [];
    const delay = makeDelayTask(order);
    const tasks = [
      delay('test1', DELAY * 3),
      delay('test2', DELAY * 2),
      delay('test3', DELAY * 1)
    ];
    const res = await Promise.resolve(tasks).race();
    assert.strictEqual(res, 'test3');
    assert.deepStrictEqual(order, ['test3']);
  });

  it('should catch an error', async () => {

    const order = [];
    const delay = makeDelayTask(order);
    const tasks = [
      delay('test1', new Error('error1'), DELAY * 3),
      delay('test2', null, DELAY * 2),
      delay('test3', new Error('error3'), DELAY * 1)
    ];
    try {
      await Promise.resolve(tasks).race();
      assert.fail();
    } catch (e) {
      assert.strictEqual(e.message, 'error3');
    }
    assert.deepStrictEqual(order, ['test3']);
  });

  it('should return first object if previous promise is already resolved', async () => {

    const order = [];
    const delay = makeDelayTask(order);
    const tasks = [
      delay('test1', DELAY * 3),
      delay('test2', DELAY * 2),
      delay('test3', DELAY * 1)
    ];
    const promise = Promise.resolve(tasks);
    await Promise.delay(DELAY * 4);
    const res = await promise.race();
    assert.strictEqual(res, 'test1');
  });
});
