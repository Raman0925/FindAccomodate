module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'react-native/no-inline-styles': 'warn',
    'no-use-before-define': 0,
    quotes: 0,
    'comma-dangle': 0,
    'space-before-function-paren': 0,
  },
  overrides: [
    {
      files: ['jest.setup.js', '__tests__/**/*.js', '__tests__/**/*.tsx'],
      env: {jest: true},
    },
    {
      files: ['**/*.js', '**/*.jsx'],
      parser: '@babel/eslint-parser',
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: [require.resolve('@babel/preset-env')],
        },
      },
    },
  ],
};
