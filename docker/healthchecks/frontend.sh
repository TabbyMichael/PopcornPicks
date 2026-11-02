#!/bin/sh
# Frontend health check script

set -e

# Check if the frontend is responding
wget --no-verbose --tries=1 --spider http://localhost:5173 || exit 1

exit 0
