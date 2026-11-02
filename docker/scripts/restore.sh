#!/bin/bash
# Restore script for PostgreSQL
# Usage: ./restore.sh [environment] [backup_file]

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
BACKUP_FILE=${2:-}

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

# If no backup file specified, list available backups
if [ -z "$BACKUP_FILE" ]; then
    echo -e "${YELLOW}Available backups in $BACKUP_DIR:${NC}"
    ls -lh "$BACKUP_DIR"/postgres_backup_*.sql.gz 2>/dev/null || echo "No backups found"
    echo ""
    echo "Usage: $0 $ENVIRONMENT <backup_file>"
    exit 0
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    # Try relative path from backup directory
    BACKUP_FILE="$BACKUP_DIR/$BACKUP_FILE"
    if [ ! -f "$BACKUP_FILE" ]; then
        echo -e "${RED}Backup file not found: $BACKUP_FILE${NC}"
        exit 1
    fi
fi

echo -e "${YELLOW}Restoring PostgreSQL from backup...${NC}"
echo "Container: $CONTAINER_NAME"
echo "Backup file: $BACKUP_FILE"
echo ""
echo -e "${RED}WARNING: This will replace all data in the database!${NC}"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Check if container is running
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo -e "${RED}Container $CONTAINER_NAME is not running${NC}"
    exit 1
fi

# Restore backup
echo -e "${YELLOW}Restoring backup...${NC}"
gunzip -c "$BACKUP_FILE" | docker exec -i "$CONTAINER_NAME" psql -U popcornpicks

echo -e "${GREEN}Restore completed successfully!${NC}"
