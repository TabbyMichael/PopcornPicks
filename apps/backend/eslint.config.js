// Backend ESLint flat config - shared base (@popcornpicks/config/eslint) + Node env.
import globals from 'globals';
import tseslint from 'typescript-eslint';
import base from '@popcornpicks/config/eslint';

export default tseslint.config(
  // Spread the monorepo-wide rules first, then layer backend specifics on top.
  ...base,
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      // Server code logs startup + errors intentionally (see bootstrap).
      'no-console': 'off',
    },
  },
);
