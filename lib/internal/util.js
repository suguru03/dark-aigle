'use strict';

const DEFAULT_LIMIT = 8;
const errorObj = { e: undefined };

Object.assign(exports, {
  DEFAULT_LIMIT,
  INTERNAL,
  errorObj,
  call0,
  call1,
  call3,
  call4,
  concatArray,
  compactArray,
  sort
});

function INTERNAL() {}

function call0(handler) {
  try {
    return handler();
  } catch (e) {
    errorObj.e = e;
    return errorObj;
  }
}

function call1(handler, arg1) {
  try {
    return handler(arg1);
  } catch (e) {
    errorObj.e = e;
    return errorObj;
  }
}


function call3(handler, arg1, arg2, arg3) {
  try {
    return handler(arg1, arg2, arg3);
  } catch (e) {
    errorObj.e = e;
    return errorObj;
  }
}

function call4(handler, arg1, arg2, arg3, arg4) {
  try {
    return handler(arg1, arg2, arg3, arg4);
  } catch (e) {
    errorObj.e = e;
    return errorObj;
  }
}

function concatArray(array) {
  let i = -1;
  const l = array.length;
  const result = [];
  while (++i < l) {
    const value = array[i];
    if (Array.isArray(value)) {
      result.push(...value);
    } else if (value !== undefined) {
      result.push(value);
    }
  }
  return result;
}

function compactArray(array) {
  let i = -1;
  const l = array.length;
  const result = [];
  while (++i < l) {
    const value = array[i];
    if (value !== INTERNAL) {
      result.push(value);
    }
  }
  return result;
}

function sortIterator(a, b) {
  return a.criteria - b.criteria;
}

function sort(array) {
  array.sort(sortIterator);
  let l = array.length;
  while (l--) {
    array[l] = array[l].value;
  }
  return array;
}
