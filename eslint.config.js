// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['src/components/**/*.tsx'],
    rules: {
      // react-three-fiber uses custom JSX props that eslint doesn't recognize
      'react/no-unknown-property': 'off',
    },
  },
]);
