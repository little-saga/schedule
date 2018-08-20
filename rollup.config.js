const pkg = require('./package.json')

function config(output) {
  return {
    input: 'src/index.js',
    output,
    external: ['little-saga'],
    plugins: [],
  }
}

export default [
  config({
    format: 'es',
    file: pkg.module,
  }),
  config({
    format: 'cjs',
    exports: 'named',
    file: pkg.main,
  }),
]
