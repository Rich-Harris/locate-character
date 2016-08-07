export function getLocator ( source ) {
	let originalLines = source.split( '\n' );

	let start = 0;
	let lineRanges = originalLines.map( ( line, i ) => {
		const end = start + line.length + 1;
		const range = { start, end, line: i };

		start = end;
		return range;
	});

	let i = 0;

	function rangeContains ( range, index ) {
		return range.start <= index && index < range.end;
	}

	function getLocation ( range, index ) {
		return { line: range.line, column: index - range.start, character: index };
	}

	return function locate ( search, startIndex ) {
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
}

export function locate ( source, search, startIndex ) {
	return getLocator( source )( search, startIndex );
}
