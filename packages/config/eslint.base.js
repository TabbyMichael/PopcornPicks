// Shared ESLint flat config for the PopcornPicks monorepo (Task 23).
// Consumed as `@popcornpicks/config/eslint` by each workspace's eslint.config.js,
// which layers on environment-specific globals (browser vs. node) and overrides.
// This is a .js (not .ts) file because ESLint's flat config loader runs in plain
// Node and cannot strip TypeScript types.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // Tooling / build artifacts that should never be linted.
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.config.js', '**/*.config.ts'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'eqeqeq': ['warn', 'smart'],
      'curly': ['warn', 'multi-line'],
    },
  },
);
