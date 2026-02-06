#!/bin/bash
# Emergency Rollback Script

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

REGISTRY="ghcr.io"
IMAGE_NAME="slidetheory/slidetheory-mvp"

echo -e "${YELLOW}SlideTheory Emergency Rollback${NC}"
echo "================================"
echo ""

# Check arguments
if [ $# -eq 0 ]; then
    echo "Usage: $0 <version|rollback>"
    echo ""
    echo "Examples:"
    echo "  $0 rollback     # Rollback to previous version"
    echo "  $0 v2.0.1       # Rollback to specific version"
    exit 1
fi

VERSION=$1

# Confirm
echo -e "${RED}WARNING: This will rollback the production deployment!${NC}"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Rollback cancelled."
    exit 0
fi

# Perform rollback
if [ "$VERSION" == "rollback" ]; then
    echo -e "${YELLOW}Rolling back to previous version...${NC}"
    
    # Tag current as failed
    docker tag $REGISTRY/$IMAGE_NAME:latest $REGISTRY/$IMAGE_NAME:failed-$(date +%Y%m%d-%H%M) 2>/dev/null || true
    
    # Restore previous
    docker tag $REGISTRY/$IMAGE_NAME:rollback $REGISTRY/$IMAGE_NAME:latest
else
    echo -e "${YELLOW}Rolling back to version $VERSION...${NC}"
    
    # Pull specific version
    docker pull $REGISTRY/$IMAGE_NAME:$VERSION
    
    # Tag as latest
    docker tag $REGISTRY/$IMAGE_NAME:$VERSION $REGISTRY/$IMAGE_NAME:latest
fi

# Restart
echo -e "${YELLOW}Restarting services...${NC}"
docker-compose -f ../docker/docker-compose.yml up -d

# Health check
echo -e "${YELLOW}Waiting for health check...${NC}"
sleep 10

if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}Rollback successful!${NC}"
    echo ""
    echo "Current version:"
    curl -s http://localhost:3000/api/health | grep -o '"version":"[^"]*"' | cut -d'"' -f4
else
    echo -e "${RED}Rollback failed! Service not healthy.${NC}"
    echo "Check logs: docker-compose logs app-prod"
    exit 1
fi
