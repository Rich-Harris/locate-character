import * as t from 'node:test';
import * as assert from 'node:assert';
import { locate, getLocator } from '../src/index.js';

const sample = `
A flea and a fly in a flue
Were imprisoned, so what could they do?
Said the fly, "let us flee!"
"Let us fly!" said the flea.
So they flew through a flaw in the flue.
`.trim();

const locator = getLocator(sample);

t.test('getLocator returns a function', () => {
	assert.equal(typeof locator, 'function');
});

t.test('getLocator locates by character index', () => {
	assert.deepEqual(locator(0), { line: 0, column: 0, character: 0 });
	assert.deepEqual(locator(1), { line: 0, column: 1, character: 1 });
	assert.deepEqual(locator(76), { line: 2, column: 9, character: 76 });
});

t.test('getLocator respects offsetLine: x and offsetColumn: x', () => {
	const locator = getLocator(sample, { offsetLine: 2, offsetColumn: 2 });
	assert.deepEqual(locator(0), { line: 2, column: 2, character: 0 });
});

t.test('getLocator locates by search string', () => {
	assert.deepEqual(locator('fly'), { line: 0, column: 13, character: 13 });
});

t.test('getLocator locates by search string with startIndex', () => {
	let location = locator('fly');
	assert.deepEqual(location, { line: 0, column: 13, character: 13 });

	location = locator('fly', location.character + 1);
	assert.deepEqual(location, { line: 2, column: 9, character: 76 });

	location = locator('fly', location.character + 1);
	assert.deepEqual(location, { line: 3, column: 8, character: 104 });
});

t.test('locate locates a character by index', () => {
	assert.deepEqual(locate(sample, 13), { line: 0, column: 13, character: 13 });
});

t.test('locate locates a character by string', () => {
	assert.deepEqual(locate(sample, 'fly'), {
		line: 0,
		column: 13,
		character: 13
	});
});

t.test('locate locates a character by string with startIndex', () => {
	assert.deepEqual(locate(sample, 'fly', { startIndex: 14 }), {
		line: 2,
		column: 9,
		character: 76
	});
	assert.deepEqual(locate(sample, 'fly', { startIndex: 77 }), {
		line: 3,
		column: 8,
		character: 104
	});
});

t.test('locate respects offsetLine: x and offsetColumn: x', () => {
	assert.deepEqual(locate(sample, 13, { offsetLine: 2, offsetColumn: 2 }), {
		line: 2,
		column: 15,
		character: 13
	});
});
