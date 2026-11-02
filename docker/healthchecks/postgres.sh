#!/bin/sh
# PostgreSQL health check script

set -e

# Check if PostgreSQL is ready
pg_isready -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-postgres}" || exit 1

# Check if critical extensions are installed
psql -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-postgres}" -c \
    "SELECT 1 FROM pg_extension WHERE extname IN ('pgvector', 'postgis', 'pg_cron', 'pgmq');" \
    | grep -q 1 || exit 1

exit 0
