# Docker Volumes

## Purpose
Docker volumes provide persistent storage for services. This folder contains volume configuration and documentation.

## Volume Architecture

### postgres_data
- **Purpose**: PostgreSQL data directory
- **Service**: postgres
- **Size**: Variable (depends on data)
- **Backup**: Included in automated backups
- **Environment**: Separate volumes for dev, test, prod

### postgres_backups
- **Purpose**: PostgreSQL backup storage
- **Service**: postgres
- **Size**: Variable (depends on retention policy)
- **Retention**: 7 daily, 4 weekly, 12 monthly
- **Environment**: Separate volumes for dev, test, prod

### uploads
- **Purpose**: User-uploaded files (images, etc.)
- **Service**: backend, frontend
- **Size**: Variable
- **Backup**: Included in automated backups
- **Future**: May use object storage (S3) in production

### logs
- **Purpose**: Application logs
- **Service**: All services
- **Size**: Rotated regularly
- **Retention**: 30 days
- **Future**: May use centralized logging (ELK) in production

## Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect popcornpicks_postgres_data

# Create volume
docker volume create popcornpicks_postgres_data

# Remove volume
docker volume rm popcornpicks_postgres_data

# Remove unused volumes
docker volume prune
```

## Backup Strategy

### Automated Backups
- Daily full backups of postgres_data
- Incremental backups where supported
- Backups stored in postgres_backups volume
- Automated validation after backup

### Retention Policy
- **Daily**: Keep 7 days
- **Weekly**: Keep 4 weeks
- **Monthly**: Keep 12 months
- **Yearly**: Keep 3 years

### Backup Location
- Development: Local volume
- Production: Remote storage (S3, GCS, or similar)
- Off-site copies for disaster recovery

## Volume Security

1. **Access Control**: Only services that need access can mount volumes
2. **Encryption**: At-rest encryption for sensitive volumes (production)
3. **Backup Encryption**: Backups encrypted before storage
4. **Access Logging**: Log volume mount operations
5. **Regular Audits**: Review volume access and usage

## Volume Performance

1. **Local Volumes**: Use local driver for best performance
2. **SSD Storage**: Use SSD for database volumes
3. **IOPS**: Ensure sufficient IOPS for database workloads
4. **Monitoring**: Monitor volume performance metrics

## Volume Cleanup

```bash
# Remove unused volumes
docker volume prune

# Remove all volumes (dangerous)
docker volume rm $(docker volume ls -q)

# Clean up after container removal
docker system prune -volumes
```

## Best Practices

1. Use named volumes instead of bind mounts for production
2. Document volume purpose and contents
3. Implement automated backup and validation
4. Monitor volume usage and growth
5. Regular cleanup of old backups and logs
6. Test restore procedures regularly
7. Use appropriate storage drivers for your use case
8. Consider snapshot support for your storage backend
