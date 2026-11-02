#!/bin/bash
# Clean script for Docker resources
# Usage: ./clean.sh [environment] [--volumes]

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
REMOVE_VOLUMES=${2:-false}

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

echo -e "${YELLOW}Cleaning Docker resources...${NC}"
echo "Environment: $ENVIRONMENT"
echo "Remove volumes: $REMOVE_VOLUMES"
echo ""

# Check if compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    echo -e "${RED}Compose file not found: $COMPOSE_FILE${NC}"
    exit 1
fi

# Stop and remove containers
cd "$PROJECT_ROOT"
docker compose -f "$COMPOSE_FILE" down

# Remove volumes if requested
if [ "$REMOVE_VOLUMES" = "--volumes" ] || [ "$REMOVE_VOLUMES" = "true" ]; then
    echo -e "${YELLOW}Removing volumes...${NC}"
    docker compose -f "$COMPOSE_FILE" down -v
fi

# Remove orphaned containers
echo -e "${YELLOW}Removing orphaned containers...${NC}"
docker compose -f "$COMPOSE_FILE" down --remove-orphans

# Clean up unused images
echo -e "${YELLOW}Cleaning up unused images...${NC}"
docker image prune -f

# Clean up build cache
echo -e "${YELLOW}Cleaning up build cache...${NC}"
docker builder prune -f

echo -e "${GREEN}Clean complete!${NC}"
