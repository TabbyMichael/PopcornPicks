# PopcornPicks Security Policy

## Overview

This document outlines the security policies and procedures for the PopcornPicks project.

## Critical Security Incident (RESOLVED)

### Issue
TMDB API key was committed to Git repository in `apps/frontend/.env.local`

### Resolution
- ✅ File removed from Git tracking
- ✅ `.gitignore` updated to prevent future exposure
- ⚠️ **ACTION REQUIRED**: API key must be rotated

### Immediate Actions Required

1. **Rotate TMDB API Key**
   - Go to https://www.themoviedb.org/settings/api
   - Revoke the exposed key: `702fa7f8bb878164af3765a2d83aeb6f`
   - Generate a new API key
   - Add new key to local `.env.local` file (not committed to Git)

2. **Clean Git History** (Optional but Recommended)
   ```bash
   # This rewrites Git history - use with caution
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch apps/frontend/.env.local" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push to remote (WARNING: rewrites history)
   git push origin --force --all
   ```

## Secret Management Policy

### Principles

1. **Never commit secrets to Git**
   - All environment files must be in `.gitignore`
   - Use `.env.example` for templates only
   - Never include real API keys, passwords, or tokens

2. **Environment Variable Strategy**
   - Development: `.env.local` (gitignored)
   - Production: Environment variables set in deployment platform
   - No secrets in code
   - No secrets in configuration files

3. **Secret Rotation**
   - Rotate API keys quarterly
   - Rotate database credentials quarterly
   - Rotate JWT secrets annually
   - Document all rotations

### Allowed Environment Files

```
# Template (can be committed)
.env.example

# Local development (gitignored)
.env.local
.env.development.local
.env.test.local

# Production (gitignored, set in deployment platform)
.env.production
```

### Git Ignore Rules

The following patterns must be in `.gitignore`:

```
# Environment
.env
.env.local
.env.*.local
.env.production
.env.development
.env.test
```

## Commit Message Guidelines

### DO NOT Include

- API keys
- Passwords
- Tokens
- Secret keys
- Database URLs with credentials
- Any sensitive information

### DO Include

- References to configuration files (without secrets)
- Documentation about environment setup
- References to `.env.example`

Example:
```
✅ Good: "Add environment variable template in .env.example"
❌ Bad: "Add API key to .env"
```

## Pre-Commit Hooks

### Recommended Setup

Install `husky` and `lint-staged` to prevent secret commits:

```bash
npm install -D husky lint-staged
npx husky install
```

Add pre-commit hook to check for secrets:

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check for potential secrets in staged files
if git diff --cached --name-only | xargs grep -l "API_KEY\|SECRET\|PASSWORD\|TOKEN"; then
  echo "⚠️  WARNING: Potential secrets detected in staged files!"
  echo "Please review before committing."
  exit 1
fi
```

## API Key Management

### TMDB API Key

**Current Status**: ⚠️ Needs rotation

**Procedure**:
1. Log in to TMDB
2. Navigate to Settings → API
3. Revoke old key
4. Generate new key
5. Update local `.env.local`
6. Update production environment variables

**Usage**:
- Development: Set in `.env.local`
- Production: Set as environment variable in deployment platform
- Never commit to Git

### Future API Keys

For any future API integrations:

1. Generate API key from provider
2. Add to `.env.example` as placeholder:
   ```
   VITE_SERVICE_API_KEY=your_api_key_here
   ```
3. Add to local `.env.local` with actual key
4. Document in `docs/api-integrations.md`
5. Rotate according to provider recommendations

## JWT Secret Management

### Development
Generate random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env.local`:
```
JWT_SECRET=generated_secret_here
```

### Production
- Set as environment variable in deployment platform
- Use secret management service (AWS Secrets Manager, etc.)
- Rotate annually
- Use strong random strings (32+ bytes)

## Database Credentials

### Development
Set in `.env.local`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/popcornpicks_dev
```

### Production
- Use connection pooling
- Set as environment variable
- Use secret management service
- Rotate quarterly
- Use strong passwords

## Security Best Practices

### Frontend
- Never expose API keys in client-side code
- Use backend proxy for external API calls
- Implement proper CORS configuration
- Validate all user inputs
- Sanitize all user-generated content

### Backend
- Never log sensitive data
- Implement rate limiting
- Use parameterized queries
- Validate all inputs
- Implement proper authentication/authorization
- Use HTTPS only in production

### Database
- Use Row Level Security (RLS)
- Use prepared statements
- Limit database user permissions
- Regular backups
- Enable encryption at rest

### Infrastructure
- Use HTTPS everywhere
- Implement security headers
- Regular security updates
- Network segmentation
- Firewall rules

## Incident Response

### Security Incident Procedure

1. **Identify**
   - Detect security issue
   - Assess severity
   - Determine scope

2. **Contain**
   - Stop the bleeding
   - Rotate compromised credentials
   - Disable affected services

3. **Eradicate**
   - Remove vulnerability
   - Patch systems
   - Update policies

4. **Recover**
   - Restore from clean backups
   - Monitor for recurrence
   - Document lessons learned

5. **Report**
   - Notify stakeholders
   - Document incident
   - Update procedures

## Security Checklist

### Before Committing
- [ ] No secrets in code
- [ ] No secrets in commits
- [ ] `.env` files in `.gitignore`
- [ ] Sensitive data redacted from logs
- [ ] Hardcoded credentials removed

### Before Deployment
- [ ] All secrets in environment variables
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Authentication/authorization tested
- [ ] Database permissions reviewed

### Regular Maintenance
- [ ] Quarterly secret rotation
- [ ] Monthly dependency updates
- [ ] Weekly security scans
- [ ] Regular access reviews
- [ ] Backup verification

## Resources

- [OWASP Security Guidelines](https://owasp.org/)
- [Git Security Best Practices](https://docs.github.com/en/security)
- [Environment Variables Best Practices](https://12factor.net/config)

## Contact

For security concerns, contact the security team or create a security advisory in the issue tracker.

---

**Last Updated**: 2024-08-07
**Status**: Active
