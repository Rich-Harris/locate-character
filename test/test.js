import { equal, deepEqual } from 'assert';
import { locate, getLocator } from '../dist/locate-character.js';

const sample = `
A flea and a fly in a flue
Were imprisoned, so what could they do?
Said the fly, "let us flee!"
"Let us fly!" said the flea.
So they flew through a flaw in the flue.
`.trim();

describe( 'locate-character', () => {
	describe( 'getLocator', () => {
		const locator = getLocator( sample );

		it( 'returns a function', () => {
			equal( typeof getLocator( sample ), 'function' );
		});

		it( 'locates by character index', () => {
			deepEqual( locator( 0 ), { line: 0, column: 0, character: 0 });
			deepEqual( locator( 1 ), { line: 0, column: 1, character: 1 });
			deepEqual( locator( 76 ), { line: 2, column: 9, character: 76 });
		});

		it( 'respects offsetLine: x and offsetColumn: x', () => {
			const locator = getLocator( sample, { offsetLine: 2, offsetColumn: 2 });
			deepEqual(
				locator( 0 ),
				{ line: 2, column: 2, character: 0 }
			);
		});

		it( 'locates by search string', () => {
			deepEqual( locator( 'fly' ), { line: 0, column: 13, character: 13 });
		});

		it( 'locates by search string with startIndex', () => {
			let location = locator( 'fly' );
			deepEqual( location, { line: 0, column: 13, character: 13 });

			location = locator( 'fly', location.character + 1 );
			deepEqual( location, { line: 2, column: 9, character: 76 });

			location = locator( 'fly', location.character + 1 );
			deepEqual( location, { line: 3, column: 8, character: 104 });
		});
	});

	describe( 'locate', () => {
		it( 'locates a character by index', () => {
			deepEqual( locate( sample, 13 ), { line: 0, column: 13, character: 13 });
		});

		it( 'locates a character by string', () => {
			deepEqual( locate( sample, 'fly' ), { line: 0, column: 13, character: 13 });
		});

		it( 'locates a character by string with startIndex', () => {
			deepEqual( locate( sample, 'fly', { startIndex: 14 }), { line: 2, column: 9, character: 76 });
			deepEqual( locate( sample, 'fly', { startIndex: 77 }), { line: 3, column: 8, character: 104 });
		});

		it( 'respects offsetLine: x and offsetColumn: x', () => {
			deepEqual(
				locate( sample, 13, { offsetLine: 2, offsetColumn: 2 }),
				{ line: 2, column: 15, character: 13 }
			);
		});
	});
});
