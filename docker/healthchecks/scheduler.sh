#!/bin/sh
# Scheduler health check script

set -e

# Check if the scheduler process is running
pgrep -f "node.*scheduler" > /dev/null || exit 1

# Check if the scheduler can connect to the database
if command -v pg_isready > /dev/null; then
    pg_isready -U "${POSTGRES_USER:-postgres}" -h "${POSTGRES_HOST:-postgres}" || exit 1
fi

exit 0
