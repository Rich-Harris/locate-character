import buble from 'rollup-plugin-buble';

export default {
	entry: 'src/index.js',
	moduleName: 'locateCharacter',
	plugins: [ buble() ],
	targets: [
		{ dest: 'dist/locate-character.es.js', format: 'es' },
		{ dest: 'dist/locate-character.umd.js', format: 'umd' }
	]
};
