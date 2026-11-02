#!/bin/sh
# Worker health check script

set -e

# Check if the worker process is running
pgrep -f "node.*worker" > /dev/null || exit 1

# Check if the worker can connect to the database
if command -v pg_isready > /dev/null; then
    pg_isready -U "${POSTGRES_USER:-postgres}" -h "${POSTGRES_HOST:-postgres}" || exit 1
fi

exit 0
