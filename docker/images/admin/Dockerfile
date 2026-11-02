# Multi-stage Dockerfile for Admin Service
# Stages: development, test, production

# ============================================================================
# Base Stage
# ============================================================================
FROM node:20-alpine AS base
WORKDIR /app
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
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

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
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
