'use strict';

require('..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('promisify', () => {

  it('should execute', async () => {
    const fn = callback => {
      setTimeout(() => callback(null, 1), 10);
    };
    const res = await Promise.promisify(fn)();
    assert.strictEqual(res, 1);
  });

  it('should execute with an argument', async () => {
    const fn = (a, callback) => {
      assert.strictEqual(a, 1);
      setTimeout(() => callback(null, a + 1), 10);
    };
    const res = await Promise.promisify(fn)(1);
    assert.strictEqual(res, 2);
  });

  it('should execute with two arguments', async () => {
    const fn = (a, b, callback) => {
      assert.strictEqual(a, 1);
      assert.strictEqual(b, 2);
      setTimeout(() => callback(null, a + b + 1), 10);
    };
    const res = await Promise.promisify(fn)(1, 2);
    assert.strictEqual(res, 4);
  });

  it('should execute with five arguments', async () => {
    const fn = (a, b, c, d, e, callback) => {
      assert.strictEqual(a, 1);
      assert.strictEqual(b, 2);
      assert.strictEqual(c, 3);
      assert.strictEqual(d, 4);
      assert.strictEqual(e, 5);
      callback(null, a + b + c + d + e + 1);
    };
    const res = await Promise.promisify(fn)(1, 2, 3, 4, 5);
    assert.strictEqual(res, 16);
  });

  it('should execute with non-argument', async () => {
    const fn = (callback, arg) => {
      assert.strictEqual(arg, undefined);
      callback(null, 1);
    };
    const res = await Promise.promisify(fn)();
    assert.strictEqual(res, 1);
  });

  it('should call again', async () => {
    let callCount = 0;
    const fn = callback => {
      callCount++;
      callback(null, callCount);
    };
    const promisified = Promise.promisify(fn);
    assert.strictEqual(await promisified(), 1);
    assert.strictEqual(await promisified(), 2);
    assert.strictEqual(await promisified(), 3);
    await Promise.delay(DELAY);
  });

  it('should bind oneself with string argument', async () => {
    const obj = {
      fn: function(arg, callback) {
        assert.strictEqual(this, obj);
        assert.strictEqual(arg, 1);
        callback(null, 2);
      }
    };
    const promisified = Promise.promisify(obj, 'fn');
    const res = await promisified(1);
    assert.strictEqual(res, 2);
  });

  it('should bind context', async () => {
    const ctx = {};
    const obj = {
      fn: function(arg, callback) {
        assert.strictEqual(this, ctx);
        assert.strictEqual(arg, 1);
        callback(null, 2);
      }
    };
    const promisified = Promise.promisify(obj.fn, { context: ctx });
    const res = await promisified(1);
    assert.strictEqual(res, 2);
  });

  it('should execute with five arguments', async () => {
    const fn = (a, b, c, d, e, callback) => {
      assert.strictEqual(a, 1);
      assert.strictEqual(b, 2);
      assert.strictEqual(c, 3);
      assert.strictEqual(d, 4);
      assert.strictEqual(e, 5);
      callback(null, a + b + c + d + e + 1);
    };
    const obj = { fn };
    const res = await Promise.promisify(obj, 'fn')(1, 2, 3, 4, 5);
    assert.strictEqual(res, 16);
  });

  it('should throw an error if second argument is boolean', async () => {

    let error;
    const obj = {
      fn: callback => callback()
    };
    try {
      Promise.promisify(obj, true);
    } catch(e) {
      error = e;
    }
    assert.ok(error);
  });

  it('should throw an error if first argument is invalid', async () => {

    let error;
    try {
      Promise.promisify('test');
    } catch(e) {
      error = e;
    }
    assert.ok(error);
  });

  it('should throw an error if error is caused', async () => {

    const error = new TypeError('error');
    const obj = {
      test: callback => callback(error)
    };
    try {
      await Promise.promisify(obj, 'test')();
      assert.fail();
    } catch (e) {
      assert.strictEqual(e, error);
    }
  });

  it('should not cause error even if the function is already promisified', async () => {
    const obj = {
      fn: function(arg, callback) {
        assert.strictEqual(this, obj);
        assert.strictEqual(arg, 1);
        callback(null, 2);
      }
    };
    const promisified = Promise.promisify(obj, 'fn');
    Promise.promisify(promisified);
    const key = 'test';
    obj[key] = promisified;
    Promise.promisify(obj, key);
    const res = await obj[key](1);
    assert.strictEqual(res, 2);
  });

  it('should work setTimeout the same functionality as util.promisify', async () => {

    const setTimeoutPromise = Promise.promisify(setTimeout);
    const str = 'foobar';
    const res = await setTimeoutPromise(DELAY, str);
    assert.strictEqual(res, str);
  });

  it('should work setImmediate the same functionality as util.promisify', async () => {

    const setImmedidatePromise = Promise.promisify(setImmediate);
    const str = 'foobar';
    const res = await setImmedidatePromise(str);
    assert.strictEqual(res, str);
  });
});
