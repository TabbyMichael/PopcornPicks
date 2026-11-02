# Backend Service

## Purpose
The backend service provides the REST API for PopcornPicks. It handles business logic orchestration, external API integration (TMDB), and serves as the thin orchestration layer over the PostgreSQL platform.

## Responsibilities
- REST API endpoints
- Request validation and authentication
- Business logic orchestration
- TMDB API integration
- Response formatting
- Error handling

## Configuration
- **Port**: 3001
- **Networks**: backend, frontend
- **Dependencies**: postgres
- **Environment Variables**:
  - `NODE_ENV`: development|production|test
  - `DATABASE_URL`: PostgreSQL connection string
  - `TMDB_API_KEY`: TMDB API key
  - `PORT`: Server port

## Health Check
- Endpoint: `http://localhost:3001/health`
- Interval: 30s
- Timeout: 10s
- Retries: 3

## Deployment
- Built with multi-stage Dockerfile
- Development: Hot-reload with volume mounts
- Production: Optimized Node.js build

## Scaling
- Horizontal scaling possible
- Stateless design
- Connection pooling to PostgreSQL
