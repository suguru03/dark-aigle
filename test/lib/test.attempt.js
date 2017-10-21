'use strict';

require('../..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('attempt', () => {

  it('should execute', async () => {

    const value = 1;
    const handler = async () => {
      await Promise.delay(DELAY);
      return value;
    };
    const res = await Promise.attempt(handler);
    assert.strictEqual(res, value);
  });

  it('should throw an error on synchronous', async () => {

    const error = new Error('error');
    const handler = () => {
      throw error;
    };
    try {
      await Promise.attempt(handler);
    } catch (e) {
      assert.strictEqual(e, error);
    }
  });

  it('should throw an error on asynchronous', async () => {

    const error = new Error('error');
    const handler = async () => {
      await Promise.delay(DELAY);
      throw error;
    };
    try {
      await Promise.attempt(handler);
    } catch (e) {
      assert.strictEqual(e, error);
    }
  });
});

parallel('try', () => {

  it('should execute', async () => {

    const value = 1;
    const handler = async () => {
      await Promise.delay(DELAY);
      return value;
    };
    const res = await Promise.try(handler);
    assert.strictEqual(res, value);
  });
});
