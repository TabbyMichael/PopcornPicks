# Docker Networks

## Purpose
Docker networks provide isolation and communication channels between services. This folder contains network configuration and documentation.

## Network Architecture

### Frontend Network
- **Purpose**: Communication between user-facing services
- **Services**: frontend, admin, nginx
- **Access**: External (via nginx)
- **Isolation**: Low (exposed to internet)

### Backend Network
- **Purpose**: Communication between application services
- **Services**: backend, worker, scheduler, postgres-exporter
- **Access**: Internal only
- **Isolation**: Medium (not directly exposed)

### Database Network
- **Purpose**: Database communication
- **Services**: postgres, postgres-exporter
- **Access**: Internal only
- **Isolation**: High (most restricted)

### Monitoring Network
- **Purpose**: Monitoring and observability
- **Services**: prometheus, grafana, node-exporter, postgres-exporter
- **Access**: Internal (Grafana exposed via nginx)
- **Isolation**: Medium

## Network Security

1. **Defense in Depth**: Multiple network layers provide security boundaries
2. **Least Privilege**: Services only connected to networks they need
3. **Internal Networks**: Backend and database networks are internal (no external access)
4. **Network Segmentation**: Prevents lateral movement if a service is compromised

## Network Configuration

Networks are defined in docker-compose files:
- `compose.dev.yml`: Development networks
- `compose.prod.yml`: Production networks (with internal flags)
- `compose.monitoring.yml`: Monitoring network

## Network Management

```bash
# List networks
docker network ls

# Inspect network
docker network inspect popcornpicks_frontend

# Create network manually
docker network create popcornpicks_frontend

# Remove network
docker network rm popcornpicks_frontend
```

## Best Practices

1. Use custom networks instead of default bridge
2. Name networks consistently with project prefix
3. Document network purpose and access patterns
4. Use internal networks for sensitive services
5. Monitor network traffic in production
6. Regularly audit network memberships
