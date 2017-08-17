'use strict';

const errorObj = { e: undefined };

Object.assign(exports, {
  errorObj,
  call0
});

function call0(handler) {
  try {
    return handler();
  } catch (e) {
    errorObj.e;
    return e;
  }
}
