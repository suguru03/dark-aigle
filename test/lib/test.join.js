'use strict';

require('../..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const util = require('../util');
const { DELAY } = require('../config');

parallel('join', () => {

  it('should execute on parallel', async () => {

    const order = [];
    const delay = util.makeDelayTask(order);
    const tasks = [
      delay(1, DELAY * 3),
      delay(2, DELAY * 2),
      delay(3, DELAY * 1)
    ];
    const fn = (arg1, arg2, arg3) =>  arg1 + arg2 + arg3;
    const res = await Promise.join(tasks[0], tasks[1], tasks[2], fn);
    assert.strictEqual(res, 6);
    assert.deepEqual(order, [3, 2, 1]);
  });

  it('should work by non promise tasks', async () => {

    const tasks = [2, 3, 1];
    const fn = (arg1, arg2, arg3) =>  arg1 + arg2 + arg3;
    const res = await Promise.join(tasks[0], tasks[1], tasks[2], fn);
    assert.strictEqual(res, 6);
  });

  it('should ignore if last argument is not function', async () => {

    const tasks = [2, 3, 1];
    const res = await Promise.join(tasks[0], tasks[1], tasks[2]);
    assert.deepEqual(res, [2, 3, 1]);
  });

  it('should throw typeEror', async () => {

    const tasks = [2, 3, 1];
    const res = await Promise.join(tasks[0], tasks[1], tasks[2]);
    assert.deepEqual(res, [2, 3, 1]);
  });

  it('should throw TypeError', async () => {

    const tasks = [1, 4, 2];
    const fn = value => value.test();
    try {
      await Promise.join(tasks[0], tasks[1], tasks[2], fn);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});
