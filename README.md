# dark-aigle

Dark Aigle has dark magic.

The library extends a native Promise or a Promise library to have [Aigle](https://github.com/suguru03/aigle) functions.

It is mainly used for a native Promise because of Async/Await restrictuion. See [Example](https://github.com/suguru03/dark-aigle#example)

## Usage

You just need to call this library somewhere then the Promise will be extended.

```js
require('dark-aigle')(Promise);
```

## Example

```js
main();

async function something() {
  await new Promise((resolve) => setTimeout(resolve));
}

async function getArray() {
  await something();
  return [1, 2, 3];
}

async function filterIterator(num) {
  await something();
  return num % 2 === 1;
}

async function mapIterator(num) {
  await something();
  return num * 2;
}

async function main() {
  const array = await getArray();
  const boolList = await Promise.all(array.map(filterIterator));
  const filtered = array.filter((n, i) => boolList[i]);
  const result = await Promise.all(filtered.map(mapIterator));
  console.log(result); // [2, 6]
}
```

If you use the library, you can make it simple and readable.

```
requrie('dark-aigle')(Promise);

main();

async function main() {
  const result = await getArray()
    .filter(filterIterator)
    .map(mapIterator);
  console.log(result); // [2, 6]
}
```
