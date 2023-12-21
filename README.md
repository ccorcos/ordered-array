# Ordered Array

Utilities for working with ordered arrays efficiently using binary search.

## Getting Started

```sh
npm i @ccorcos/ordered-array
```

```ts
type Item = {key: number, value: number}
type Key = number

const getKey = (item: Item) => item.key
const compareKey = (key1: Key, key2: Key) => key1 - key2

const { search, insert, update, remove } = orderedArray(getKey, compareKey)

const array: Item[] = [
	{ key: 10, value: 0 },
	{ key: 11, value: 1 },
	{ key: 12, value: 2 },
	{ key: 13, value: 3 },
	{ key: 14, value: 4 },
]

let result = search(array, 12)
// {found: 2}

result = search(array, 12.5)
// {closest: 3}

insert(array, { key: 12.5, value: 2.5 })

remove(array, 13)

// Double the value if it exists, otherwise insert with value: 0
update(array, 10, (item) => {
	if (item) return { ...item, value: item.value * 2 }
	else {key: 10, value: 0}
})

// Double the value if it exists, otherwise don't do anything
update(array, 10, (item) => {
	if (item) return { ...item, value: item.value * 2 }
})

// Insert item only if it does not exist.
update(array, 10.5, (item) => {
	if (item) return
	else {key: 10.5, value: 0}
})
```