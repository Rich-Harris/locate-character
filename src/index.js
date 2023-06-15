/** @typedef {import('./types').Location} Location */

/**
 * @param {string} source
 * @param {import('./types').Options} [options]
 */
export function getLocator(source, options = {}) {
	const offsetLine = options.offsetLine || 0;
	const offsetColumn = options.offsetColumn || 0;

	let originalLines = source.split('\n');

	let start = 0;
	let lineRanges = originalLines.map((line, i) => {
		const end = start + line.length + 1;

		/** @type {import('./types').Range} */
		const range = { start, end, line: i };

		start = end;
		return range;
	});

	let i = 0;

	/**
	 * @param {import('./types').Range} range
	 * @param {number} index
	 */
	function rangeContains(range, index) {
		return range.start <= index && index < range.end;
	}

	/**
	 * @param {import('./types').Range} range
	 * @param {number} index
	 * @returns {Location}
	 */
	function getLocation(range, index) {
		return {
			line: offsetLine + range.line,
			column: offsetColumn + index - range.start,
			character: index
		};
	}

	/**
	 * @param {string | number} search
	 * @param {number} [startIndex]
	 * @returns {Location | undefined}
	 */
	function locate(search, startIndex) {
		if (typeof search === 'string') {
			search = source.indexOf(search, startIndex || 0);
		}

		if (search === -1) return undefined;

		let range = lineRanges[i];

		const d = search >= range.end ? 1 : -1;

		while (range) {
			if (rangeContains(range, search)) return getLocation(range, search);

			i += d;
			range = lineRanges[i];
		}
	}

	return locate;
}

/**
 * @param {string} source
 * @param {string | number} search
 * @param {import('./types').Options} [options]
 * @returns {Location | undefined}
 */
export function locate(source, search, options) {
	return getLocator(source, options)(search, options && options.startIndex);
}
