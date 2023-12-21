import { strict as assert } from "assert"
import { describe, it } from "mocha"
import { binarySearch, insert, remove, update } from "./ordered-array"

describe("ordered array", () => {
	it("works", () => {
		const array = [
			{ key: 0, value: 0 },
			{ key: 1, value: 1 },
			{ key: 2, value: 2 },
			{ key: 3, value: 3 },
			{ key: 4, value: 4 },
		]

		// Find key: 2
		let result = binarySearch(array, (item) => item.key - 2)
		assert.equal(result.found, 2)

		// Find key: 2.5
		result = binarySearch(array, (item) => item.key - 2.5)
		assert.equal(result.closest, 3)

		// Insert into the array.
		insert({ key: 2.5, value: 2.5 }, array, (a, b) => a.key - b.key)
		assert.deepEqual(array, [
			{ key: 0, value: 0 },
			{ key: 1, value: 1 },
			{ key: 2, value: 2 },
			{ key: 2.5, value: 2.5 },
			{ key: 3, value: 3 },
			{ key: 4, value: 4 },
		])

		// Remove from the array.
		remove(array, (item) => item.key - 3)
		assert.deepEqual(array, [
			{ key: 0, value: 0 },
			{ key: 1, value: 1 },
			{ key: 2, value: 2 },
			{ key: 2.5, value: 2.5 },
			{ key: 4, value: 4 },
		])

		// Update-replace an item in the array.
		// Careful not to change the order!
		let defaultValue = { key: 1, value: 2 }
		update(
			array,
			(item) => item.key - 1,
			(item) => (item ? { ...item, value: item.value * 2 } : defaultValue)
		)
		assert.deepEqual(array, [
			{ key: 0, value: 0 },
			{ key: 1, value: 2 },
			{ key: 2, value: 2 },
			{ key: 2.5, value: 2.5 },
			{ key: 4, value: 4 },
		])

		// Update-insert an item in the array.
		defaultValue = { key: 1.5, value: 3 }
		update(
			array,
			(item) => item.key - 1.5,
			(item) => (item ? { ...item, value: item.value * 2 } : defaultValue)
		)
		assert.deepEqual(array, [
			{ key: 0, value: 0 },
			{ key: 1, value: 2 },
			{ key: 1.5, value: 3 },
			{ key: 2, value: 2 },
			{ key: 2.5, value: 2.5 },
			{ key: 4, value: 4 },
		])

		// Update-insert-if-does-not-exist an item in the array.
		defaultValue = { key: 0.5, value: 1 }
		update(
			array,
			(item) => item.key - 0.5,
			(item) => (item ? undefined : defaultValue)
		)
		assert.deepEqual(array, [
			{ key: 0, value: 0 },
			{ key: 0.5, value: 1 },
			{ key: 1, value: 2 },
			{ key: 1.5, value: 3 },
			{ key: 2, value: 2 },
			{ key: 2.5, value: 2.5 },
			{ key: 4, value: 4 },
		])

		// Update-if-exists an item in the array.
		// Case 1: item does exist
		update(
			array,
			(item) => item.key - 0.5,
			(item) => (item ? { ...item, value: item.value * 2 } : undefined)
		)
		assert.deepEqual(array, [
			{ key: 0, value: 0 },
			{ key: 0.5, value: 2 },
			{ key: 1, value: 2 },
			{ key: 1.5, value: 3 },
			{ key: 2, value: 2 },
			{ key: 2.5, value: 2.5 },
			{ key: 4, value: 4 },
		])
		// Case 2: item does exist
		update(
			array,
			(item) => item.key - 0.25,
			(item) => (item ? { ...item, value: item.value * 2 } : undefined)
		)
		assert.deepEqual(array, [
			{ key: 0, value: 0 },
			{ key: 0.5, value: 2 },
			{ key: 1, value: 2 },
			{ key: 1.5, value: 3 },
			{ key: 2, value: 2 },
			{ key: 2.5, value: 2.5 },
			{ key: 4, value: 4 },
		])
	})

	it("property test", () => {
		const numbers = randomNumbers(200)

		const a: { k: number; v: number }[] = []
		const b: { k: number; v: number }[] = []

		for (let i = 0; i < numbers.length; i++) {
			// insert
			const n = numbers[i]
			a.push({ k: n, v: n })
			a.sort(compare)
			insert({ k: n, v: n }, b, compare)
			assert.deepEqual(a, b)

			// For every other value currently in the array.
			for (let j = 0; j < i; j++) {
				const m = numbers[j]
				// binarySearch
				assert.equal(
					a.findIndex((x) => x.k === m),
					binarySearch(a, (x) => x.k - m).found
				)
				assert.equal(
					a.findIndex((x) => x.k === m) + 1,
					binarySearch(a, (x) => x.k - m - 0.1).closest
				)
				assert.equal(
					a.findIndex((x) => x.k === m),
					binarySearch(a, (x) => x.k - m + 0.1).closest
				)

				// upsert - update
				let aa = a.map((x) => (x.k === m ? { k: m, v: m * 2 } : x))
				const bb = [...b]
				update(
					bb,
					(x) => x.k - m,
					(x) => ({ k: x!.k, v: x!.k * 2 })
				)
				assert.deepEqual(aa, bb)

				// remove
				aa = aa.filter((x) => x.k !== m)
				remove(bb, (x) => x.k - m)
				assert.deepEqual(aa, bb)

				// upsert - insert
				aa.push({ k: m, v: m * 3 })
				aa.sort(compare)
				update(
					bb,
					(x) => x.k - m,
					(x) => (x ? x : { k: m, v: m * 3 })
				)
				assert.deepEqual(aa, bb)
			}
		}
	})
})

const randomNumbers = (n: number) =>
	uniq(
		Array(n)
			.fill(0)
			.map(() => Math.floor(Math.random() * n * 2))
	)

const compare = (a: { k: number }, b: { k: number }) => a.k - b.k

const uniq = (list: number[]) => {
	const seen = new Set<number>(list)
	return list.filter((n) => {
		if (seen.has(n)) return false
		seen.add(n)
		return true
	})
}
