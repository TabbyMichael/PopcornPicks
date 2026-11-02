#!/bin/bash
# Stop script for Docker services
# Usage: ./stop.sh [environment]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
COMPOSE_DIR="$PROJECT_ROOT/compose"

# Default environment
ENVIRONMENT=${1:-dev}

# Map environment names to compose files
case $ENVIRONMENT in
    dev|development)
        COMPOSE_FILE="$COMPOSE_DIR/compose.dev.yml"
        ;;
    test)
        COMPOSE_FILE="$COMPOSE_DIR/compose.test.yml"
        ;;
    prod|production)
        COMPOSE_FILE="$COMPOSE_DIR/compose.prod.yml"
        ;;
    *)
        echo -e "${RED}Unknown environment: $ENVIRONMENT${NC}"
        echo "Available environments: dev, test, prod"
        exit 1
        ;;
esac

echo -e "${YELLOW}Stopping Docker services...${NC}"
echo "Environment: $ENVIRONMENT"
echo "Compose file: $COMPOSE_FILE"
echo ""

# Check if compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    echo -e "${RED}Compose file not found: $COMPOSE_FILE${NC}"
    exit 1
fi

# Stop services
cd "$PROJECT_ROOT"
docker compose -f "$COMPOSE_FILE" down

echo -e "${GREEN}Services stopped successfully!${NC}"
