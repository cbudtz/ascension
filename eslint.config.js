import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.vite/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/{presentation,bootstrap}/**/*.ts'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['tests/e2e/**/*.ts', '*.config.{js,cjs,mjs,ts}'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['src/{core,application,content,infrastructure}/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'phaser',
              message: 'Phaser belongs in presentation or bootstrap',
            },
          ],
          patterns: [
            {
              group: ['phaser/*'],
              message: 'Phaser belongs in presentation or bootstrap',
            },
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
);
