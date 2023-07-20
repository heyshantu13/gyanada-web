module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'node', 'import', 'promise', 'mongodb'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:node/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:promise/recommended',
    'plugin:mongodb/recommended',
  ],
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: false,
    },
  },
  settings: {
    node: {
      tryExtensions: ['.ts', '.js', '.json', '.node'],
    },
  },
  rules: {
    // Add your custom rules here, or use the recommended rules provided by the plugins.

    // TypeScript specific rules
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',

    // Node.js and CommonJS rules
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-import': 'off',

    // Import rules
    'import/no-default-export': 'error',

    //Mongo
    'mongodb/check-insert-calls': 'error',
    'mongodb/check-update-calls': 'error',
    'mongodb/check-query-calls': 'error',
    'mongodb/check-remove-calls': 'error',
    'mongodb/check-deprecated-calls': 'error',

    // General best practices
    'no-console': 'warn',

    // Code style and conventions
    'camelcase': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
  },
};
