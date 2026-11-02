# CI/CD

## Purpose
Continuous Integration and Continuous Deployment pipelines for automated building, testing, security scanning, and deployment.

## GitHub Actions Workflows

### build.yml
**Purpose**: Build Docker images for all services

**Triggers**:
- Push to main/develop branches
- Pull requests to main/develop branches

**Jobs**:
- build-frontend: Build and test frontend image
- build-backend: Build and test backend image
- build-admin: Build and test admin image
- build-postgres: Build PostgreSQL image
- build-worker: Build and test worker image

### test.yml
**Purpose**: Run automated tests across all services

**Triggers**:
- Push to main/develop branches
- Pull requests to main/develop branches

**Jobs**:
- test-database: Run database tests with PostgreSQL service
- test-backend: Run backend tests with PostgreSQL service
- test-frontend: Run frontend tests
- test-admin: Run admin tests

### security.yml
**Purpose**: Security scanning and vulnerability detection

**Triggers**:
- Push to main/develop branches
- Pull requests to main/develop branches
- Daily schedule (midnight UTC)

**Jobs**:
- vulnerability-scan: Trivy filesystem scanner
- dependency-check: npm audit for dependencies
- docker-scan: Trivy Docker image scanner

### lint.yml
**Purpose**: Code quality and linting

**Triggers**:
- Push to main/develop branches
- Pull requests to main/develop branches

**Jobs**:
- lint-backend: ESLint and TypeScript check
- lint-frontend: ESLint and TypeScript check
- lint-admin: ESLint and TypeScript check
- lint-database: SQL linter

## Pipeline Stages

### 1. Build
- Build Docker images
- Multi-stage builds
- Layer caching
- Parallel builds

### 2. Test
- Unit tests
- Integration tests
- E2E tests
- Database tests

### 3. Security
- Vulnerability scanning
- Dependency checking
- Docker image scanning
- Static analysis

### 4. Lint
- ESLint for JavaScript/TypeScript
- TypeScript type checking
- SQL linting
- Code style checks

### 5. Deploy (Future)
- Image publishing
- Environment deployment
- Smoke tests
- Rollback capability

## Secrets Required

The following secrets must be configured in GitHub:

| Secret | Purpose | Required |
|--------|---------|----------|
| TMDB_API_KEY | TMDB API access | Yes |
| DOCKER_USERNAME | Docker Hub username | Future |
| DOCKER_PASSWORD | Docker Hub password | Future |
| AWS_ACCESS_KEY_ID | AWS access | Future |
| AWS_SECRET_ACCESS_KEY | AWS secret | Future |

## Deployment Strategy

### Development
- Automatic deployment on push to develop
- Deploy to development environment
- Run smoke tests
- Notify team on failure

### Staging (Future)
- Automatic deployment on merge to main
- Deploy to staging environment
- Run full test suite
- Manual approval for production

### Production (Future)
- Manual deployment from staging
- Deploy to production environment
- Run smoke tests
- Monitor for issues
- Rollback on failure

## Best Practices

1. **Fast Feedback**: Keep pipelines fast (< 10 minutes)
2. **Parallel Execution**: Run jobs in parallel where possible
3. **Caching**: Use caching for dependencies
4. **Security**: Never log secrets
5. **Notifications**: Notify team on failures
6. **Rollback**: Always have rollback capability
7. **Testing**: Test the pipeline itself
8. **Documentation**: Keep workflows documented
9. **Monitoring**: Monitor pipeline performance
10. **Idempotency**: Pipelines should be idempotent

## Monitoring

### Metrics
- Pipeline duration
- Success rate
- Failure rate
- Queue time
- Resource usage

### Alerts
- Pipeline failure
- Security vulnerability found
- Test failure
- Deployment failure
- Performance degradation

## Future Enhancements

- [ ] Image publishing to Docker Hub/ECR
- [ ] Multi-environment deployment
- [ ] Automated rollback
- [ ] Blue-green deployment
- [ ] Canary deployments
- [ ] Performance testing
- [ ] Contract testing
- [ ] Chaos engineering
- [ ] Compliance scanning
- [ ] Cost optimization
