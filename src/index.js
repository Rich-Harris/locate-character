/** @typedef {import('./types').Location} Location */

/**
 * @param {import('./types').Range} range
 * @param {number} index
 */
function rangeContains(range, index) {
	return range.start <= index && index < range.end;
}

/**
 * @param {string} source
 * @param {import('./types').Options} [options]
 */
export function getLocator(source, options = {}) {
	const { offsetLine = 0, offsetColumn = 0 } = options;

	const lines = source.split('\n');

	let start = 0;
	let ranges = lines.map((line, i) => {
		const end = start + line.length + 1;

		/** @type {import('./types').Range} */
		const range = { start, end, line: i };

		start = end;
		return range;
	});

	let i = 0;

	/**
	 * @param {string | number} search
	 * @param {number} [startIndex]
	 * @returns {Location | undefined}
	 */
	function locator(search, startIndex) {
		if (typeof search === 'string') {
			search = source.indexOf(search, startIndex || 0);
		}

		if (search === -1) return undefined;

		let range = ranges[i];

		const d = search >= range.end ? 1 : -1;

		while (range) {
			if (rangeContains(range, search)) {
				return {
					line: offsetLine + range.line,
					column: offsetColumn + search - range.start,
					character: search
				};
			}

			i += d;
			range = ranges[i];
		}
	}

	return locator;
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
