#!/usr/bin/env bash
# ============================================================================
# backup.sh
# Create a PostgreSQL backup using pg_dump.
# Usage: ./scripts/backup.sh [DATABASE_URL] [BACKUP_DIR]
# ============================================================================
set -euo pipefail

DATABASE_URL="${1:-${DATABASE_URL:-postgres://localhost:5432/popcornpicks}}"
BACKUP_DIR="${2:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../backups" && pwd)}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.dump"

mkdir -p "${BACKUP_DIR}"

echo "Creating backup: ${BACKUP_FILE}"
pg_dump "${DATABASE_URL}" -F c -f "${BACKUP_FILE}"

echo "Backup created successfully: ${BACKUP_FILE}"