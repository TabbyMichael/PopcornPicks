# Admin Service

## Purpose
The admin service provides the administrative interface for PopcornPicks. It allows administrators to manage users, content, analytics, and system configuration.

## Responsibilities
- User management
- Content moderation
- Analytics dashboard
- System configuration
- Audit log viewing
- Bulk operations

## Configuration
- **Port**: 5174 (development), 80 (production)
- **Networks**: frontend
- **Dependencies**: backend
- **Environment Variables**:
  - `NODE_ENV`: development|production
  - `VITE_API_URL`: Backend API URL

## Health Check
- Development: `http://localhost:5174`
- Production: `http://localhost:80`
- Interval: 30s
- Timeout: 10s
- Retries: 3

## Deployment
- Built with multi-stage Dockerfile
- Development: Hot-reload with volume mounts
- Production: Optimized static build with Nginx

## Security
- Requires authentication
- Role-based access control
- Audit logging for all actions
- IP whitelist in production

## Scaling
- Typically single instance
- Can be scaled if needed
- Stateless design
