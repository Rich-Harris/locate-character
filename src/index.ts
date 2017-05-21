interface Options {
	offsetLine?: number
	offsetColumn?: number
	startIndex?: number
}

interface Range {
	start: number
	end: number
	line: number
}

interface Location {
	line: number
	column: number
	character: number
}

export function getLocator ( source: string, options: Options = {} ) {
	const offsetLine = options.offsetLine || 0;
	const offsetColumn = options.offsetColumn || 0;

	let originalLines = source.split( '\n' );

	let start = 0;
	let lineRanges = originalLines.map( ( line, i ) => {
		const end = start + line.length + 1;
		const range: Range = { start, end, line: i };

		start = end;
		return range;
	});

	let i = 0;

	function rangeContains ( range: Range, index: number ) {
		return range.start <= index && index < range.end;
	}

	function getLocation ( range: Range, index: number ): Location {
		return { line: offsetLine + range.line, column: offsetColumn + index - range.start, character: index };
	}

	function locate ( search: string, startIndex?: number ): Location
	function locate ( search: number ): Location
	function locate ( search: any, startIndex?: number ): Location {
		if ( typeof search === 'string' ) {
			search = source.indexOf( search, startIndex || 0 );
		}

		let range = lineRanges[i];

		const d = search >= range.end ? 1 : -1;

		while ( range ) {
			if ( rangeContains( range, search ) ) return getLocation( range, search );

			i += d;
			range = lineRanges[i];
		}
	};

	return locate;
}

function locate ( source: string, search: string, options?: Options ): Location
function locate ( source: string, search: number, options?: Options ): Location
function locate ( source: string, search: any, options?: Options ): Location {
	if ( typeof options === 'number' ) {
		throw new Error( 'locate takes a { startIndex, offsetLine, offsetColumn } object as the third argument' );
	}

	return getLocator( source, options )( search, options && options.startIndex );
}

export { locate };
