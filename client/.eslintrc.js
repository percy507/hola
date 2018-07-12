const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true
  },

  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module'
  },

  plugins: ['html'],

  extends: 'eslint:recommended',

  rules: {
    'no-console': OFF,
    'no-extra-parens': ERROR,
    'consistent-return': ERROR,
    curly: ERROR,
    'default-case': ERROR,
    eqeqeq: ERROR,
    'no-caller': ERROR,
    'no-else-return': ERROR,
    'no-empty-function': ERROR,
    'no-eq-null': ERROR,
    'no-eval': ERROR,
    'no-extra-bind': ERROR,
    'no-extra-label': ERROR,
    'no-floating-decimal': ERROR,
    'no-labels': ERROR,
    'no-lone-blocks': ERROR,

    'no-multi-spaces': ERROR,
    'no-new-func': ERROR,
    'no-new-wrappers': ERROR,
    'no-octal-escape': ERROR,
    'no-param-reassign': ERROR,
    'no-proto': ERROR,
    'no-return-assign': ERROR,
    'no-return-await': ERROR,
    'no-self-compare': ERROR,
    'no-sequences': ERROR,
    'no-throw-literal': ERROR,
    'no-unmodified-loop-condition': ERROR,
    'no-unused-expressions': ERROR,
    'no-with': ERROR,

    'prefer-promise-reject-errors': WARN,

    radix: ERROR,

    'require-await': ERROR,

    'wrap-iife': ERROR,
    'no-undefined': ERROR,

    'new-cap': ERROR,
    'new-parens': ERROR,
    'no-array-constructor': ERROR,
    'no-new-object': ERROR,
    'no-multi-assign': ERROR,

    semi: [ERROR, 'always'],

    'no-duplicate-imports': ERROR,
    'no-useless-rename': ERROR,
    'no-var': ERROR
  }
};
