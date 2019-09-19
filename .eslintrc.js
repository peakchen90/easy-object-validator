module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    node: true
  },
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'airbnb-base'
  ],
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-mutable-exports': 'off',
    'import/no-unresolved': 'off',
    'no-console': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-new': 'off',
    'arrow-body-style': 'off',
    'no-empty-function': 'off',
    'no-nested-ternary': 'off',
    'no-return-assign': 'off',
    'no-unused-vars': 'error',
    'global-require': 'off',
    'object-curly-spacing': 'off',
    'max-len': 'off',
    'comma-dangle': 'off',
    'prefer-destructuring': 'off',
    'class-methods-use-this': 'off',
    'eol-last': 'off',
    'eqeqeq': 'off',
    'prefer-arrow-callback': 'off',
    'prefer-promise-reject-errors': 'off',
    'generator-star-spacing': 'off',
    'new-cap': 'off',
  }
};
