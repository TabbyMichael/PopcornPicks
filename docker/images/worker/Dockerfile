# Multi-stage Dockerfile for Worker Service
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
CMD ["npm", "run", "worker"]

# ============================================================================
# Test Stage
# ============================================================================
FROM base AS test
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run test:worker --if-present

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
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/worker.js"]
