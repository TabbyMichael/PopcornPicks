# Docker Platform

Enterprise-grade Docker platform for PopcornPicks modular monolith application.

## Overview

This Docker platform provides a complete containerized infrastructure for development, testing, and production deployment. It follows PostgreSQL-first architecture principles and provides all necessary services for the application.

## Architecture

### Services

| Service        | Purpose                                                       | Ports                 |
| -------------- | ------------------------------------------------------------- | --------------------- |
| **Frontend**   | User-facing React application                                 | 5173 (dev), 80 (prod) |
| **Backend**    | REST API and business logic orchestration                     | 3001                  |
| **Admin**      | Administrative interface                                      | 5174 (dev), 80 (prod) |
| **PostgreSQL** | Complete application platform (data, search, messaging, etc.) | 5432                  |
| **Nginx**      | Reverse proxy and load balancer                               | 80, 443               |
| **Worker**     | Background job processor                                      | -                     |
| **Scheduler**  | Scheduled job processor                                       | -                     |
| **Mail**       | Email service (Mailhog in dev)                                | 1025, 8025            |

### Networks

- **frontend**: Public-facing services
- **backend**: Internal application services
- **database**: Database communication
- **monitoring**: Monitoring and observability

### Volumes

- **postgres_data**: PostgreSQL data directory
- **postgres_backups**: PostgreSQL backup storage
- **uploads**: User-uploaded files
- **logs**: Application logs

## Directory Structure

```
docker/
├── README.md
├── compose/                      # Docker Compose files
│   ├── compose.dev.yml          # Development environment
│   ├── compose.test.yml         # Testing environment
│   ├── compose.prod.yml         # Production environment
│   ├── compose.override.yml     # Local overrides
│   ├── compose.monitoring.yml   # Monitoring stack
│   └── compose.local.yml        # Local development tools
├── images/                       # Docker images
│   ├── frontend/                # Frontend Dockerfile
│   ├── backend/                 # Backend Dockerfile
│   ├── admin/                   # Admin Dockerfile
│   ├── postgres/                # PostgreSQL Dockerfile
│   └── worker/                  # Worker Dockerfile
├── services/                     # Service documentation
│   ├── frontend/
│   ├── backend/
│   ├── postgres/
│   ├── admin/
│   ├── nginx/
│   ├── worker/
│   ├── scheduler/
│   └── mail/
├── networks/                     # Network configuration
├── volumes/                      # Volume configuration
├── configs/                      # Configuration files
│   ├── .env.example             # Environment template
│   ├── env.development          # Development environment
│   ├── env.production           # Production environment
│   ├── env.test                 # Test environment
│   ├── nginx/                   # Nginx configuration
│   └── monitoring/             # Monitoring configuration
├── scripts/                      # Utility scripts
│   ├── build.sh                 # Build images
│   ├── start.sh                 # Start services
│   ├── stop.sh                  # Stop services
│   ├── restart.sh               # Restart services
│   ├── clean.sh                 # Clean up resources
│   ├── backup.sh                # Backup PostgreSQL
│   ├── restore.sh               # Restore PostgreSQL
│   ├── logs.sh                  # View logs
│   ├── health.sh                # Check health
│   └── shell.sh                 # Open shell
├── healthchecks/                 # Health check scripts
├── logging/                      # Logging configuration
├── backups/                      # Backup storage
│   ├── dev/
│   └── prod/
├── security/                     # Security configuration
├── cicd/                         # CI/CD pipelines
│   └── .github/workflows/
├── monitoring/                   # Monitoring configuration
│   ├── prometheus/
│   ├── grafana/
│   ├── dashboards/
│   └── alerts/
└── templates/                    # Deployment templates
    ├── kubernetes/
    ├── helm/
    └── terraform/
```

## Quick Start

### Development

```bash
# Copy environment file
cp docker/configs/.env.example .env

# Start development services
docker/scripts/start.sh dev

# View logs
docker/scripts/logs.sh dev

# Stop services
docker/scripts/stop.sh dev
```

### Production

```bash
# Set production environment
cp docker/configs/env.production .env

# Start production services
docker/scripts/start.sh prod

# Add monitoring stack
docker compose -f docker/compose/compose.prod.yml -f docker/compose/compose.monitoring.yml up -d
```

## Usage

### Building Images

```bash
# Build all images
docker/scripts/build.sh all

# Build specific image
docker/scripts/build.sh frontend
docker/scripts/build.sh backend
```

### Managing Services

```bash
# Start services
docker/scripts/start.sh [dev|test|prod]

# Stop services
docker/scripts/stop.sh [dev|test|prod]

# Restart services
docker/scripts/restart.sh [dev|test|prod]

# Clean up resources
docker/scripts/clean.sh [dev|test|prod] [--volumes]
```

### Backup and Restore

```bash
# Backup database
docker/scripts/backup.sh [dev|prod]

# Restore database
docker/scripts/restore.sh [dev|prod] [backup_file]

# List available backups
ls docker/backups/dev/
ls docker/backups/prod/
```

### Monitoring

```bash
# Check service health
docker/scripts/health.sh [dev|test|prod]

# View logs
docker/scripts/logs.sh [dev|test|prod] [service]

# Open shell in container
docker/scripts/shell.sh [dev|test|prod] [service]
```

## PostgreSQL Configuration

The PostgreSQL service includes all required extensions:

- **pgvector**: Vector search and embeddings
- **PostGIS**: Geospatial queries
- **pg_trgm**: Fuzzy text search
- **pg_cron**: Scheduled jobs
- **pgmq**: Message queues
- **uuid-ossp**: UUID generation
- **pgcrypto**: Cryptographic functions
- **citext**: Case-insensitive text
- **hstore**: Key-value storage
- **btree_gin**: Composite GIN indexes
- **btree_gist**: Composite GiST indexes
- **tablefunc**: Crosstab analytics
- **ltree**: Hierarchical data
- **intarray**: Integer array operations
- **pg_stat_statements**: Query performance monitoring

## Security

- All containers run as non-root users
- Network segmentation for service isolation
- Row Level Security (RLS) on all database tables
- Secrets managed via environment variables
- TLS/SSL in production
- Regular security scanning via CI/CD

## Monitoring

- **Prometheus**: Metrics collection
- **Grafana**: Visualization and dashboards
- **PostgreSQL Exporter**: Database metrics
- **Node Exporter**: System metrics

Access Grafana at `http://localhost:3000` (default: admin/admin)

## CI/CD

GitHub Actions workflows for:

- **Build**: Automated Docker image building
- **Test**: Automated testing across all services
- **Security**: Vulnerability scanning and dependency checks
- **Lint**: Code quality and style checks

## Backup Strategy

- **Daily**: Full backups, retained for 7 days
- **Weekly**: Weekly backups, retained for 4 weeks
- **Monthly**: Monthly backups, retained for 12 months
- **Validation**: Automatic backup integrity checks

## Development Tools

Local development tools (optional):

- **pgAdmin**: PostgreSQL management (port 5050)
- **Mailhog**: Email testing (ports 1025, 8025)

Enable with: `docker compose -f docker/compose/compose.dev.yml -f docker/compose/compose.local.yml up -d`

## Production Deployment

### Prerequisites

1. Configure production environment variables
2. Set up SSL/TLS certificates
3. Configure external storage for backups
4. Set up monitoring and alerting
5. Configure email service integration

### Deployment Steps

1. Build production images
2. Push to container registry
3. Deploy to production servers
4. Run smoke tests
5. Monitor for issues

### Scaling

- **Horizontal**: Scale frontend, backend, worker services
- **Vertical**: Adjust resource limits in compose files
- **Database**: Use managed PostgreSQL service for production

## Troubleshooting

### Container won't start

```bash
# Check logs
docker/scripts/logs.sh [environment] [service]

# Check health
docker/scripts/health.sh [environment]

# Restart service
docker/scripts/restart.sh [environment]
```

### Database connection issues

```bash
# Check PostgreSQL is running
docker/scripts/health.sh [environment]

# Check network connectivity
docker network inspect popcornpicks_backend

# Verify environment variables
docker compose config
```

### Build failures

```bash
# Clean build cache
docker builder prune -f

# Remove old images
docker image prune -a -f

# Rebuild without cache
docker compose build --no-cache
```

## Best Practices

1. **Never commit secrets** to repository
2. **Use specific image tags** in production
3. **Regularly update base images**
4. **Monitor resource usage**
5. **Test restores regularly**
6. **Keep backups off-site**
7. **Review logs regularly**
8. **Use health checks**
9. **Implement rate limiting**
10. **Document custom configurations**

## Future Enhancements

- [ ] Kubernetes deployment manifests
- [ ] Helm charts for package management
- [ ] Terraform for infrastructure as code
- [ ] Advanced monitoring (distributed tracing)
- [ ] Automated scaling (HPA)
- [ ] Service mesh (Istio/Linkerd)
- [ ] CDN integration
- [ ] Multi-region deployment
- [ ] Disaster recovery automation
- [ ] Cost optimization

## Documentation

- [Database Architecture](../database/README.md)
- [API Documentation](../docs/api/README.md)
- [Deployment Guide](../docs/deployment/README.md)
- [Architecture Decisions](../docs/decisions/README.md)

## Support

For issues or questions:

- Check troubleshooting section
- Review service-specific documentation in `docker/services/`
- Consult database documentation in `database/`
- Check GitHub Issues for known problems
