# Docker Backups

## Purpose
Automated backup and restore procedures for PostgreSQL data and application state.

## Backup Strategy

### PostgreSQL Backups

#### Full Backups
- **Frequency**: Daily
- **Method**: pg_dumpall
- **Compression**: gzip
- **Storage**: Local volume (dev), Cloud storage (prod)
- **Retention**: 7 daily, 4 weekly, 12 monthly

#### Incremental Backups (Future)
- **Frequency**: Hourly
- **Method**: WAL archiving
- **Storage**: Cloud storage
- **Retention**: 24 hours

### Backup Schedule

| Type | Frequency | Time | Retention |
|------|-----------|------|-----------|
| Full | Daily | 2:00 AM UTC | 7 days |
| Weekly | Weekly | Sunday 2:00 AM UTC | 4 weeks |
| Monthly | Monthly | 1st of month 2:00 AM UTC | 12 months |
| Yearly | Yearly | January 1st 2:00 AM UTC | 3 years |

## Backup Locations

### Development
- **Path**: `docker/backups/dev/`
- **Storage**: Local volume
- **Access**: Local filesystem

### Production
- **Path**: `docker/backups/prod/`
- **Storage**: Cloud storage (S3, GCS, or similar)
- **Access**: Encrypted, restricted

## Backup Scripts

### Automated Backup
Location: `docker/scripts/backup.sh`

Usage:
```bash
./docker/scripts/backup.sh dev
./docker/scripts/backup.sh prod
```

Features:
- Full PostgreSQL backup
- Compression with gzip
- Timestamped filename
- Automatic cleanup of old backups
- Backup validation

### Manual Backup
```bash
# Backup specific database
docker exec postgres pg_dump -U popcornpicks dbname > backup.sql

# Backup all databases
docker exec postgres pg_dumpall -U popcornpicks > backup.sql

# Compressed backup
docker exec postgres pg_dumpall -U popcornpicks | gzip > backup.sql.gz
```

## Restore Procedures

### Automated Restore
Location: `docker/scripts/restore.sh`

Usage:
```bash
./docker/scripts/restore.sh dev postgres_backup_20240101_020000.sql.gz
./docker/scripts/restore.sh prod postgres_backup_20240101_020000.sql.gz
```

### Manual Restore
```bash
# Restore from compressed backup
gunzip -c backup.sql.gz | docker exec -i postgres psql -U popcornpicks

# Restore all databases
gunzip -c backup.sql.gz | docker exec -i postgres psql -U popcornpicks -d postgres
```

## Backup Validation

### Integrity Checks
- Verify backup file exists
- Check file size (not empty)
- Validate gzip integrity
- Test restore to temporary database
- Verify data checksums

### Validation Script
```bash
#!/bin/bash
# Validate backup integrity

BACKUP_FILE=$1

# Check if file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found"
    exit 1
fi

# Check file size
if [ $(stat -f%z "$BACKUP_FILE") -lt 100 ]; then
    echo "Backup file too small"
    exit 1
fi

# Validate gzip
if ! gzip -t "$BACKUP_FILE"; then
    echo "Backup file corrupted"
    exit 1
fi

echo "Backup validation passed"
```

## Backup Encryption

### Development
- Encryption: Not required
- Access: Local filesystem
- Keys: None

### Production
- Encryption: AES-256
- Key Management: AWS KMS / GCP KMS
- Access: IAM roles
- Keys: Rotated quarterly

## Off-site Storage

### Development
- Off-site: Not required
- Replication: None

### Production
- Off-site: Required
- Replication: Cross-region
- Storage Class: Standard → Glacier
- Availability: 99.99%

## Disaster Recovery

### RPO (Recovery Point Objective)
- **Target**: 1 hour
- **Achievable**: 24 hours (daily backups)
- **With WAL**: 5 minutes (future)

### RTO (Recovery Time Objective)
- **Target**: 4 hours
- **Achievable**: 2 hours
- **With automation**: 30 minutes (future)

### Recovery Steps
1. Identify last good backup
2. Download backup from storage
3. Decrypt backup (if encrypted)
4. Validate backup integrity
5. Stop application services
6. Restore database
7. Verify data integrity
8. Start application services
9. Run smoke tests
10. Monitor for issues

## Monitoring

### Metrics
- Backup success rate
- Backup duration
- Backup size
- Storage usage
- Restore success rate
- Time since last backup

### Alerts
- Backup failed
- Backup validation failed
- Storage capacity warning
- Restore failed
- Backup overdue

## Best Practices

1. **Test Restores**: Regularly test restore procedures
2. **Off-site Copies**: Store backups in multiple locations
3. **Encryption**: Encrypt production backups
4. **Access Control**: Restrict backup access
5. **Documentation**: Document recovery procedures
6. **Automation**: Automate backup and validation
7. **Retention**: Follow retention policies
8. **Monitoring**: Monitor backup health
9. **Capacity Planning**: Monitor storage growth
10. **Security**: Never commit backup keys to repository
