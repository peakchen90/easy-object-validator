const commonjs = require('rollup-plugin-commonjs');
const typescript = require('rollup-plugin-typescript');
const uglify = require('rollup-plugin-uglify').uglify;
const pkg = require('./package.json');

const banner = '' +
  '/**\n' +
  ' * easy-object-validator' + '\n' +
  ' * @author ' + pkg.author + '\n' +
  ' * @version ' + pkg.version + '\n' +
  ' * @licence ' + pkg.license + '\n' +
  ' * @link https://github.com/peakchen90/easy-object-validator\n' +
  ' */';

function getOutput(format, minify = false) {
  const name = 'validator';
  const output = {};

  let file = name;
  if (format && format !== 'umd') file += '.' + format;
  if (minify) file += '.' + 'min';

  output.file = 'dist/' + file + '.js';
  output.format = format;
  if (format === 'umd') output.name = name;

  output.sourcemap = true;
  output.banner = banner;

  return output;
}

const config = {
  input: 'src/index.ts',
  output: [
    getOutput('umd'),
    getOutput('esm'),
    getOutput('cjs')
  ],
  plugins: [
    commonjs(),
    typescript()
  ],
};

const uglifyConfig = {
  ...config,
  output: [
    getOutput('umd', true)
  ],
  plugins: config.plugins.concat(uglify())
};

module.exports = [
  config,
  uglifyConfig
];
