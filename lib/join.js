'use strict';

Promise.join = join;

function join() {
  let l = arguments.length;
  const handler = typeof arguments[l - 1] === 'function' ? arguments[--l] : undefined;
  const tasks = Array(l);
  while (l--) {
    tasks[l] = arguments[l];
  }
  const promise = Promise.all(tasks);
  return handler ? promise.then(args => handler.apply(null, args)) : promise;
}
