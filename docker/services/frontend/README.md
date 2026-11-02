# Frontend Service

## Purpose
The frontend service provides the user-facing web application for PopcornPicks. It is built with React/Vite and serves the static assets for the movie discovery platform.

## Responsibilities
- Serve the React application
- Handle client-side routing
- Provide responsive UI
- Communicate with backend API
- Manage client-side state

## Configuration
- **Port**: 5173 (development), 80 (production)
- **Networks**: frontend
- **Dependencies**: backend
- **Environment Variables**:
  - `NODE_ENV`: development|production
  - `VITE_API_URL`: Backend API URL

## Health Check
- Development: `http://localhost:5173`
- Production: `http://localhost:80`
- Interval: 30s
- Timeout: 10s
- Retries: 3

## Deployment
- Built with multi-stage Dockerfile
- Development: Hot-reload with volume mounts
- Production: Optimized static build with Nginx

## Scaling
- Horizontal scaling possible behind load balancer
- Stateless design allows multiple instances
- No persistent storage required
