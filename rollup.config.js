const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify').uglify;
const packageConfig = require('./package.json');

const config = {
  input: 'src/index.js',
  output: {
    file: 'dist/validator.js',
    format: 'umd',
    name: 'validator'
  },
  plugins: [
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  banner: `/**\n * easy-object-valodator version ${packageConfig.version} \n */`,
}

module.exports = [
  config,
  // mini
  Object.assign({}, config, {
    output: Object.assign({}, config.output, {
      file: 'dist/validator.min.js'
    }),
    plugins: config.plugins.concat(uglify())
  })
];
