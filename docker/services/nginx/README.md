# Nginx Service

## Purpose
The Nginx service acts as a reverse proxy and load balancer for the PopcornPicks platform. It handles SSL termination, static file serving, and request routing to appropriate backend services.

## Responsibilities
- Reverse proxy for frontend, backend, and admin
- SSL/TLS termination
- Static file serving
- Request routing
- Load balancing
- Gzip compression
- Caching headers
- Rate limiting
- Security headers

## Configuration
- **Ports**: 80 (HTTP), 443 (HTTPS)
- **Networks**: frontend, backend
- **Dependencies**: frontend, backend, admin
- **Configuration**: configs/nginx/nginx.conf

## Health Check
- Endpoint: `http://localhost/health`
- Interval: 30s
- Timeout: 10s
- Retries: 3

## SSL/TLS
- Certificates stored in configs/nginx/ssl
- Automatic renewal via certbot (future)
- HTTP to HTTPS redirect
- Strong cipher suites

## Security Features
- Security headers (CSP, HSTS, X-Frame-Options)
- Rate limiting
- IP whitelist for admin routes
- Request size limits
- Connection timeouts

## Performance
- Gzip compression
- Static file caching
- Keep-alive connections
- Worker process optimization
- Buffer size tuning

## Routing
- `/`: Frontend application
- `/api`: Backend API
- `/admin`: Admin panel
- `/static`: Static assets

## Deployment
- Production only
- Alpine-based image
- Configuration mounted as read-only
