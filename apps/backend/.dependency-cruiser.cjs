// dependency-cruiser config - enforces module public-API discipline (ADR / Task 21).
//
// Rule: a file living inside `src/modules/<name>/...` may depend on ANOTHER
// module only through that module's public barrel (`src/modules/<other>/index.ts`).
// Deep imports into another module's internals (services/, controllers/, ...) are
// an error so modules stay separable into future microservices.
module.exports = {
  forbidden: [
    {
      name: 'no-cross-module-deep-import',
      severity: 'error',
      comment:
        'Cross-module imports must go through the module barrel (modules/<name>/index.ts). Reach into another module only via its public API.',
      // from: any file inside a module (capture the module dir name as $1)
      from: { path: '^src/modules/([^/]+)/' },
      // to: a DIFFERENT module ($1 != other) whose path continues past the barrel index.ts
      to: {
        path: '^src/modules/(?!(?:$1)/)[^/]+/(?!(?:index\\.ts$)).*$',
      },
    },
    {
      name: 'no-orphans',
      severity: 'info',
      comment: 'Informational only - unreferenced files are not blocking.',
      from: {
        orphan: true,
        pathNot: [
          '\\.d\\.ts$',
          '(^|/)[^/]*\\.test\\.[jt]sx?$',
          'src/.*index\\.ts$',
          'node_modules/',
        ],
      },
      to: {
        pathNot: ['(^|/)package\\.json$', '(^|/)tsconfig.*\\.json$'],
      },
    },
  ],
  options: {
    // ESM: specifiers carry `.js` extensions that map to `.ts` sources.
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    doNotFollow: {
      path: 'node_modules',
    },
    exclude: {
      dynamic: true,
    },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      extensions: ['.ts', '.js', '.json'],
    },
  },
};
