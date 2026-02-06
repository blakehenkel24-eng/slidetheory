# Multi-stage Docker build for SlideTheory
# Stage 1: Dependencies + Chromium
FROM node:20-slim AS base

# Install Chromium and dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libatk-bridge2.0-0 \
    libxss1 \
    libgtk-3-0 \
    libgbm-dev \
    libasound2 \
    fonts-liberation \
    libappindicator3-1 \
    xdg-utils \
    wget \
    ca-certificates \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Stage 2: Dependencies installation
FROM base AS dependencies

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Stage 3: Production image
FROM base AS production

# Create non-root user for security
RUN groupadd -r slidetheory && useradd -r -g slidetheory -d /app slidetheory

# Copy dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application code
COPY --chown=slidetheory:slidetheory . .

# Create required directories with proper permissions
RUN mkdir -p tmp/slides tmp/exports logs \
    && chown -R slidetheory:slidetheory /app

# Switch to non-root user
USER slidetheory

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]

# Stage 4: Development image (optional)
FROM dependencies AS development

RUN npm ci && npm cache clean --force

COPY . .

RUN mkdir -p tmp/slides tmp/exports logs

EXPOSE 3000

CMD ["npm", "run", "dev"]
