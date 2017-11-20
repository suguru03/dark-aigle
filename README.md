<p align="center">
  <img alt="aigle" src="https://raw.githubusercontent.com/suguru03/dark-aigle/gh-pages/images/logo.png" width=500>
</p>

Dark Aigle has dark power.

The library extends a native Promise or a Promise library to have [Aigle functions](https://github.com/suguru03/aigle#functions).

It is mainly used for a native Promise because of Async/Await restrictuion. See [Example](https://github.com/suguru03/dark-aigle#example).

## Usage

You just need to call this library somewhere. The Promise will be extended.

```js
require('dark-aigle')(Promise);
```

## Example

```js
async function executeAsyncTask() {
  await new Promise(resolve => setTimeout(resolve));
}

async function getArray() {
  await executeAsyncTask();
  return [1, 2, 3];
}

async function filterIterator(num) {
  await executeAsyncTask();
  return num % 2 === 1;
}

async function mapIterator(num) {
  await executeAsyncTask();
  return num * 2;
}
```

```js
test();

async function test() {
  const array = await getArray();
  const boolList = await Promise.all(array.map(filterIterator));
  const filtered = array.filter((n, i) => boolList[i]);
  const result = await Promise.all(filtered.map(mapIterator));
  console.log(result); // [2, 6]
}
```

If you use the library, you can make it simple and readable.

```js
requrie('dark-aigle')(Promise);

test();

async function test() {
  const result = await getArray()
    .filter(filterIterator)
    .map(mapIterator);
  console.log(result); // [2, 6]
}
```
