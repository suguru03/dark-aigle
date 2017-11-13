'use strict';

require('..');

const assert = require('assert');

const parallel = require('mocha.parallel');

parallel('promisifyAll', () => {

  it('should extend an instance', async () => {

    class Test {
      constructor() {
        this._value = undefined;
      }
      set(value, callback) {
        setImmediate(() => {
          this._value = value;
          callback();
        });
      }
      get(callback) {
        setImmediate(() => callback(null, this._value));
      }
    }
    const test = new Test();
    test.put = () => {};
    Promise.promisifyAll(test);
    assert.ok(test.setAsync);
    assert.ok(test.getAsync);
    assert.ok(test.putAsync);

    const str = 'test';
    await test.setAsync(str);
    const res = await test.getAsync();
    assert.strictEqual(res, str);
  });

  it('should extend redis sample', async () => {

    const test = 'test';
    function RedisClient() {}
    RedisClient.prototype.get = function(key, callback) {
      callback(null, `${key}_${test}`);
    };
    RedisClient.test = function() {};
    const redis = {
      RedisClient: RedisClient,
      test: function() {}
    };
    Promise.promisifyAll(redis);
    assert.strictEqual(typeof redis.RedisClient.prototype.getAsync, 'function');
    assert.strictEqual(typeof redis.RedisClient.testAsync, 'function');
    const client = new RedisClient();
    const key = 'key';
    const res = await client.getAsync(key);
    assert.strictEqual(res, `${key}_${test}`);
  });

  it('should throw an error if suffix is invalid', () => {

    let error;
    const obj = {
      get: () => {},
      getAsync: () => {}
    };
    try {
      Promise.promisifyAll(obj);
    } catch (e) {
      error = e;
    }
    assert.ok(error);
  });

  it('should not affect getter/setter', () => {
    const obj = {
      _value: undefined,
      get value() {
        return this._value;
      },
      set value(value) {
        this._value = value + 10;
      }
    };
    const promisified = Promise.promisifyAll(obj);
    assert.strictEqual(promisified.getAsync, undefined);
    assert.strictEqual(promisified.setAsync, undefined);
    promisified.value = 10;
    assert.strictEqual(promisified.value, 20);
  });

  it('should not cause error even if object is promisified twice', () => {

    class Test {
      constructor() {
        this._value = undefined;
      }
      get(callback) {
        setImmediate(() => callback(null, this._value));
      }
    }
    Promise.promisifyAll(Test);
    Promise.promisifyAll(Test);
  });
});
