'use strict';

const errorObj = { e: undefined };

Object.assign(exports, {
  errorObj,
  call0,
  call3
});

function call0(handler) {
  try {
    return handler();
  } catch (e) {
    errorObj.e;
    return e;
  }
}

function call3(handler, arg1, arg2, arg3) {
  try {
    return handler(arg1, arg2, arg3);
  } catch (e) {
    errorObj.e;
    return e;
  }
}
