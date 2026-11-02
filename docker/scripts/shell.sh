#!/bin/bash
# Shell script for accessing Docker containers
# Usage: ./shell.sh [environment] [service]

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

# Default environment and service
ENVIRONMENT=${1:-dev}
SERVICE=${2:-postgres}

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

# Check if compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    echo -e "${RED}Compose file not found: $COMPOSE_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}Opening shell in $SERVICE...${NC}"
echo "Environment: $ENVIRONMENT"
echo ""

cd "$PROJECT_ROOT"

# Open shell in container
docker compose -f "$COMPOSE_FILE" exec "$SERVICE" /bin/sh
