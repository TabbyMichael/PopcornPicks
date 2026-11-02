#!/bin/bash
# Restart script for Docker services
# Usage: ./restart.sh [environment]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${YELLOW}Restarting Docker services...${NC}"
echo ""

# Stop services
"$SCRIPT_DIR/stop.sh" "$1"

# Wait a moment
sleep 2

# Start services
"$SCRIPT_DIR/start.sh" "$1"

echo -e "${GREEN}Services restarted successfully!${NC}"
