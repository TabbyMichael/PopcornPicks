# Dependency Management

## Overview

This document describes the dependency management policy for the PopcornPicks project.

## Dependency Audit (2024-08-07)

### Removed Dependencies

The following dependencies were identified as unused and removed:

| Package | Reason | Removed |
|---------|--------|----------|
| `@hookform/resolvers` | Not used in codebase | ✅ Removed |
| `zod` | Not used in codebase | ✅ Removed |
| `@tailwindcss/typography` | Not used in codebase | ✅ Removed |

### Kept Dependencies

The following dependencies were flagged as unused by depcheck but are **intentionally kept**:

| Package | Reason for Keeping |
|---------|-------------------|
| `react-hook-form` | Used in `src/shared/components/ui/form.tsx` |
| `autoprefixer` | Required by Tailwind CSS |
| `postcss` | Required by Tailwind CSS |
| `depcheck` | Dev tool for dependency audits |

### Heavy Dependencies

The following dependencies contribute significantly to bundle size but are actively used:

| Package | Size | Usage | Notes |
|---------|------|-------|-------|
| `recharts` | Large | Charts (possibly unused) | Consider removing if not used |
| `embla-carousel-react` | Medium | Carousels | Used in multiple components |
| `@radix-ui/*` (40+ packages) | Large | UI components | All actively used |

## Dependency Management Policy

### Adding Dependencies

1. **Necessity Check**
   - Is this dependency absolutely necessary?
   - Can the functionality be built with existing dependencies?
   - Is there a lighter alternative?

2. **Size Review**
   - Check bundle size impact
   - Consider tree-shaking support
   - Evaluate runtime performance

3. **Security Review**
   - Check for known vulnerabilities
   - Review maintainer reputation
   - Check update frequency

4. **Documentation**
   - Document why the dependency was added
   - Document intended usage
   - Document alternatives considered

### Removing Dependencies

1. **Usage Verification**
   - Search codebase for imports
   - Check for indirect usage
   - Check peer dependencies

2. **Breaking Changes**
   - Check if other packages depend on it
   - Test removal in development
   - Test removal in production build

3. **Deprecation Policy**
   - Wait for stable deprecation (not experimental)
   - Follow semver guidelines
   - Update documentation

### Version Management

#### Production Dependencies

- **Rule**: Use versions at least 7 days old
- **Reason**: Avoid newly published packages that may be yanked
- **Implementation**: Pin to specific versions, avoid `*` or `latest`

#### Development Dependencies

- **Rule**: Can use newer versions
- **Reason**: Dev tools are not deployed to production
- **Implementation**: Caret ranges (`^`) acceptable

#### Update Strategy

1. **Monthly**: Review and update dependencies
2. **Quarterly**: Major version updates
3. **Immediately**: Security vulnerabilities (CVSS 7+)

### Dependency Categories

#### Core Dependencies
These are essential for the application to function:
- React
- React Router
- TypeScript
- Vite
- Tailwind CSS

#### UI Dependencies
These provide UI components and styling:
- Radix UI components
- shadcn/ui utilities
- Tailwind CSS

#### Feature Dependencies
These enable specific features:
- TanStack Query (data fetching)
- react-hook-form (forms)
- date-fns (date manipulation)
- lucide-react (icons)

#### Development Dependencies
These are only used during development:
- ESLint
- TypeScript
- Vitest (when added)
- Prettier (when added)

## Security

### Vulnerability Scanning

Run security scans regularly:
```bash
npm audit
npm audit fix
```

### Security Updates

**Critical/High Severity**: Fix immediately
**Moderate Severity**: Fix within 1 week
**Low Severity**: Fix in next scheduled update

### Known Vulnerabilities

As of 2024-08-07, there are 4 vulnerabilities (3 moderate, 1 high). These should be addressed.

### npm Audit Fix

Before running `npm audit fix`, review the changes:
```bash
npm audit fix --dry-run
```

Never use `--force` without reviewing breaking changes.

## Package Manager

### Primary Package Manager

**npm** is the primary package manager for this project.

### Workspaces

The project uses npm workspaces:
```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

### Lockfile

**package-lock.json** is committed to version control for reproducible builds.

## Dependency Scripts

### Audit
```bash
npm audit
```

### Check for Unused Dependencies
```bash
npx depcheck
```

### Update Outdated Packages
```bash
npm outdated
npm update
```

### Clean Install
```bash
rm -rf node_modules package-lock.json
npm install
```

## Bundle Size Management

### Current Bundle Size

- **Total JS**: ~593 KB (gzipped: ~168 KB)
- **Total CSS**: ~97 KB (gzipped: ~15 KB)

### Optimization Strategies

1. **Code Splitting**
   - Lazy load routes
   - Dynamic imports for heavy components
   - Split vendor bundles

2. **Tree Shaking**
   - Use ES modules
   - Avoid importing entire libraries
   - Import specific functions

3. **Minification**
   - Vite handles automatically
   - Terser plugin configured

4. **Compression**
   - gzip enabled in production
   - Consider Brotli in deployment

### Monitoring

Monitor bundle size in CI/CD:
```bash
npm run build
# Check output for bundle size warnings
```

## Review Schedule

- **Weekly**: Check for security vulnerabilities
- **Monthly**: Review and update dependencies
- **Quarterly**: Major version updates and bundle size review
- **As Needed**: When adding new features

## Resources

- [npm Audit Documentation](https://docs.npmjs.com/cli/audit)
- [Depcheck Documentation](https://github.com/depcheck/depcheck)
- [Bundle Size Optimization](https://web.dev/fast/)

---

**Last Updated**: 2024-08-07
**Status**: Active
