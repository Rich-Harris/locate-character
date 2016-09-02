const fs = require( 'fs' );
const path = require( 'path' );
const assert = require( 'assert' );
const { locate, getLocator } = require( '..' );

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
			assert.equal( typeof getLocator( sample ), 'function' );
		});

		it( 'locates by character index', () => {
			assert.deepEqual( locator( 0 ), { line: 0, column: 0, character: 0 });
			assert.deepEqual( locator( 1 ), { line: 0, column: 1, character: 1 });
			assert.deepEqual( locator( 76 ), { line: 2, column: 9, character: 76 });
		});

		it( 'respects offsetLine: x and offsetColumn: x', () => {
			const locator = getLocator( sample, { offsetLine: 2, offsetColumn: 2 });
			assert.deepEqual(
				locator( 0 ),
				{ line: 2, column: 2, character: 0 }
			);
		});

		it( 'locates by search string', () => {
			assert.deepEqual( locator( 'fly' ), { line: 0, column: 13, character: 13 });
		});

		it( 'locates by search string with startIndex', () => {
			let location = locator( 'fly' );
			assert.deepEqual( location, { line: 0, column: 13, character: 13 });

			location = locator( 'fly', location.character + 1 );
			assert.deepEqual( location, { line: 2, column: 9, character: 76 });

			location = locator( 'fly', location.character + 1 );
			assert.deepEqual( location, { line: 3, column: 8, character: 104 });
		});
	});

	describe( 'locate', () => {
		it( 'locates a character by index', () => {
			assert.deepEqual( locate( sample, 13 ), { line: 0, column: 13, character: 13 });
		});

		it( 'locates a character by string', () => {
			assert.deepEqual( locate( sample, 'fly' ), { line: 0, column: 13, character: 13 });
		});

		it( 'locates a character by string with startIndex', () => {
			assert.deepEqual( locate( sample, 'fly', { startIndex: 14 }), { line: 2, column: 9, character: 76 });
			assert.deepEqual( locate( sample, 'fly', { startIndex: 77 }), { line: 3, column: 8, character: 104 });
		});

		it( 'respects offsetLine: x and offsetColumn: x', () => {
			assert.deepEqual(
				locate( sample, 13, { offsetLine: 2, offsetColumn: 2 }),
				{ line: 2, column: 15, character: 13 }
			);
		});
	});
});
