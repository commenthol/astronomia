export default {
  input: [
    './src/index.js',
    './src/vsop87.js',
    './data/index.js'
  ],
  output: {
    dir: 'lib',
    format: 'cjs',
    entryFileNames: '[name].cjs',
    exports: 'named',
    preserveModules: true,
    preserveModulesRoot: 'src'
  }
}
