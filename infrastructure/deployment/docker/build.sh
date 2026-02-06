# Build and push Docker image script
#!/bin/bash
set -e

# Configuration
REGISTRY=${REGISTRY:-"ghcr.io"}
IMAGE_NAME=${IMAGE_NAME:-"slidetheory/slidetheory-mvp"}
VERSION=${VERSION:-$(cat ../../mvp/build/package.json | grep -o '"version": "[^"]*"' | cut -d'"' -f4)}
TAG=${TAG:-$VERSION}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Building SlideTheory Docker Image${NC}"
echo "Registry: $REGISTRY"
echo "Image: $IMAGE_NAME"
echo "Version: $VERSION"
echo "Tag: $TAG"
echo ""

# Build arguments
BUILD_ARGS="--build-arg NODE_ENV=production"

# Build multi-stage image
echo -e "${YELLOW}Building production image...${NC}"
docker build \
    $BUILD_ARGS \
    --target production \
    -t $REGISTRY/$IMAGE_NAME:$TAG \
    -t $REGISTRY/$IMAGE_NAME:latest \
    -f Dockerfile \
    ../../mvp/build

# Check if push is requested
if [ "$1" == "--push" ]; then
    echo -e "${YELLOW}Pushing to registry...${NC}"
    docker push $REGISTRY/$IMAGE_NAME:$TAG
    docker push $REGISTRY/$IMAGE_NAME:latest
    echo -e "${GREEN}Successfully pushed $REGISTRY/$IMAGE_NAME:$TAG${NC}"
else
    echo -e "${GREEN}Build complete. Use --push to push to registry.${NC}"
fi

echo ""
echo -e "${GREEN}To run the container:${NC}"
echo "docker run -p 3000:3000 --env-file ../config/.env.production $REGISTRY/$IMAGE_NAME:$TAG"
