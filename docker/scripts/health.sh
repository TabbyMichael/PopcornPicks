#!/bin/bash
# Health check script for Docker services
# Usage: ./health.sh [environment]

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

# Check if compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    echo -e "${RED}Compose file not found: $COMPOSE_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}Checking service health...${NC}"
echo "Environment: $ENVIRONMENT"
echo ""

cd "$PROJECT_ROOT"

# Get all services
SERVICES=$(docker compose -f "$COMPOSE_FILE" config --services)

# Check each service
for service in $SERVICES; do
    # Get container status
    STATUS=$(docker compose -f "$COMPOSE_FILE" ps -q "$service" | xargs docker inspect --format='{{.State.Status}}' 2>/dev/null || echo "not running")

    # Get health status if available
    HEALTH=$(docker compose -f "$COMPOSE_FILE" ps -q "$service" | xargs docker inspect --format='{{.State.Health.Status}}' 2>/dev/null || echo "N/A")

    # Color code based on status
    if [ "$STATUS" = "running" ]; then
        if [ "$HEALTH" = "healthy" ] || [ "$HEALTH" = "N/A" ]; then
            echo -e "${GREEN}✓ $service${NC} - Status: $STATUS, Health: $HEALTH"
        else
            echo -e "${YELLOW}⚠ $service${NC} - Status: $STATUS, Health: $HEALTH"
        fi
    else
        echo -e "${RED}✗ $service${NC} - Status: $STATUS"
    fi
done

echo ""
echo -e "${GREEN}Health check complete!${NC}"
