#!/bin/sh
# Backend health check script

set -e

# Check if the backend health endpoint is responding
wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

exit 0
