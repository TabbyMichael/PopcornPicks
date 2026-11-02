#!/bin/bash
# Build script for Docker images
# Usage: ./build.sh [service] [environment]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Default values
SERVICE=${1:-all}
ENVIRONMENT=${2:-development}

echo -e "${GREEN}Building Docker images...${NC}"
echo "Service: $SERVICE"
echo "Environment: $ENVIRONMENT"
echo ""

# Function to build a single image
build_image() {
    local image=$1
    local dockerfile="$PROJECT_ROOT/images/$image/Dockerfile"
    local context="$PROJECT_ROOT/images/$image"

    if [ ! -f "$dockerfile" ]; then
        echo -e "${RED}Dockerfile not found for $image${NC}"
        return 1
    fi

    echo -e "${YELLOW}Building $image...${NC}"
    docker build \
        -f "$dockerfile" \
        -t "popcornpicks/$image:$ENVIRONMENT" \
        -t "popcornpicks/$image:latest" \
        "$context" || {
        echo -e "${RED}Failed to build $image${NC}"
        return 1
    }
    echo -e "${GREEN}Successfully built $image${NC}"
}

# Build based on service argument
case $SERVICE in
    all)
        build_image "frontend"
        build_image "backend"
        build_image "admin"
        build_image "postgres"
        build_image "worker"
        ;;
    frontend|backend|admin|postgres|worker)
        build_image "$SERVICE"
        ;;
    *)
        echo -e "${RED}Unknown service: $SERVICE${NC}"
        echo "Available services: all, frontend, backend, admin, postgres, worker"
        exit 1
        ;;
esac

echo -e "${GREEN}Build complete!${NC}"
