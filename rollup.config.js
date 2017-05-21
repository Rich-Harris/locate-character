import typescript from 'rollup-plugin-typescript';

export default {
	entry: 'src/index.ts',
	moduleName: 'locateCharacter',
	plugins: [
		typescript({
			typescript: require('typescript')
		})
	],
	targets: [
		{ dest: 'dist/locate-character.es.js', format: 'es' },
		{ dest: 'dist/locate-character.umd.js', format: 'umd' }
	]
};
