export type BinarySearchResult =
	| { found: number; closest?: undefined }
	| { found?: undefined; closest: number }

/** `closest` is the closest index that doesn't exceed. */
export function binarySearch<T>(
	list: Array<T>,
	compare: (a: T) => number
): BinarySearchResult {
	var min = 0
	var max = list.length - 1
	while (min <= max) {
		var k = (max + min) >> 1
		var dir = compare(list[k]) * -1
		if (dir > 0) {
			min = k + 1
		} else if (dir < 0) {
			max = k - 1
		} else {
			return { found: k }
		}
	}
	return { closest: min }
}

export function insert<T>(
	value: T,
	list: Array<T>,
	compare: (a: T, b: T) => number
): T | undefined {
	const result = binarySearch(list, (item) => compare(item, value))
	if (result.found !== undefined) {
		// Replace the whole item.
		const [old] = list.splice(result.found, 1, value)
		return old
	} else {
		// Insert at missing index.
		list.splice(result.closest, 0, value)
	}
}

/**
 * Careful not to change the order!
 * If update returns undefined, the item is removed.
 */
export function update<T>(
	list: Array<T>,
	compare: (a: T) => number,
	update: (existing?: T) => T | undefined
) {
	const result = binarySearch(list, compare)
	if (result.found !== undefined) {
		// Replace the whole item.
		const newItem = update(list[result.found])
		if (newItem === undefined) list.splice(result.found, 1)
		else list.splice(result.found, 1, newItem)
	} else {
		// Insert at missing index.
		const newItem = update()
		if (newItem !== undefined) list.splice(result.closest, 0, newItem)
	}
}

export function remove<T>(list: T[], compare: (a: T) => number): T | undefined {
	let { found } = binarySearch(list, compare)
	if (found !== undefined) {
		// Remove from index.
		const [old] = list.splice(found, 1)
		return old
	}
}
