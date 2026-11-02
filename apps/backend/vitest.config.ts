// Vitest config for the backend.
// The source is authored as ESM with NodeNext-style `./foo.js` specifiers that
// resolve to `./foo.ts` at runtime (tsx). Vite does not do that remapping on its
// own, so this small plugin teaches the resolver to fall back to `.ts`.
import { existsSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { defineConfig, type Plugin } from 'vitest/config';

function resolveJsToTs(): Plugin {
  return {
    name: 'backend-resolve-js-to-ts',
    enforce: 'pre',
    apply: 'serve',
    resolveId(source, importer) {
      if (!importer || !source.startsWith('.') || !source.endsWith('.js')) return null;
      const candidate = resolvePath(dirname(importer), source.slice(0, -3) + '.ts');
      return existsSync(candidate) ? candidate : null;
    },
  };
}

export default defineConfig({
  plugins: [resolveJsToTs()],
  test: {
    environment: 'node',
    // Only collect real suites; the per-module `tests/index.test.ts` scaffolding
    // stays out of the run until those modules grow tests.
    include: ['tests/**/*.test.ts'],
    // Deterministic env so pure units (JWT sign/verify, TMDB URL building) never
    // depend on a real .env, database, or network.
    env: {
      NODE_ENV: 'test',
      JWT_SECRET: 'test-secret-do-not-use-in-prod',
      TMDB_API_KEY: 'test-tmdb-key',
    },
  },
});
