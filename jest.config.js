const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname),
  moduleFileExtensions: [
    'js',
    'ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  coverageDirectory: "./test/coverage/",
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,ts}'
  ],
};
