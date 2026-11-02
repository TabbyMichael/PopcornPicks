# Multi-stage Dockerfile for Backend Service
# Stages: development, test, production

# ============================================================================
# Base Stage
# ============================================================================
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache postgresql-client
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ============================================================================
# Development Stage
# ============================================================================
FROM base AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --if-present
EXPOSE 3001
CMD ["npm", "run", "dev"]

# ============================================================================
# Test Stage
# ============================================================================
FROM base AS test
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run test --if-present
RUN npm run test:e2e --if-present

# ============================================================================
# Build Stage
# ============================================================================
FROM base AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ============================================================================
# Production Stage
# ============================================================================
FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache postgresql-client dumb-init
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=build /app/dist ./dist
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
