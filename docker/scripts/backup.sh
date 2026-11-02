#!/bin/bash
# Backup script for PostgreSQL
# Usage: ./backup.sh [environment]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Default environment
ENVIRONMENT=${1:-dev}

# Container name based on environment
case $ENVIRONMENT in
    dev|development)
        CONTAINER_NAME="popcornpicks-postgres-dev"
        BACKUP_DIR="$PROJECT_ROOT/backups/dev"
        ;;
    prod|production)
        CONTAINER_NAME="popcornpicks-postgres-prod"
        BACKUP_DIR="$PROJECT_ROOT/backups/prod"
        ;;
    *)
        echo -e "${RED}Unknown environment: $ENVIRONMENT${NC}"
        echo "Available environments: dev, prod"
        exit 1
        ;;
esac

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/postgres_backup_$TIMESTAMP.sql.gz"

echo -e "${GREEN}Creating PostgreSQL backup...${NC}"
echo "Container: $CONTAINER_NAME"
echo "Backup file: $BACKUP_FILE"
echo ""

# Check if container is running
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo -e "${RED}Container $CONTAINER_NAME is not running${NC}"
    exit 1
fi

# Create backup
docker exec "$CONTAINER_NAME" pg_dumpall -U popcornpicks | gzip > "$BACKUP_FILE"

# Verify backup was created
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}Backup file was not created${NC}"
    exit 1
fi

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo -e "${GREEN}Backup created successfully!${NC}"
echo "File: $BACKUP_FILE"
echo "Size: $BACKUP_SIZE"
echo ""

# Keep only last 7 daily backups
echo -e "${YELLOW}Cleaning old backups (keeping last 7 daily)...${NC}"
find "$BACKUP_DIR" -name "postgres_backup_*.sql.gz" -type f -mtime +7 -delete

echo -e "${GREEN}Backup process complete!${NC}"
