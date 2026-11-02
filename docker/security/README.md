# Docker Security

## Purpose
Security configuration and best practices for Docker containers and infrastructure.

## Security Principles

1. **Least Privilege**: Containers run with minimal permissions
2. **Defense in Depth**: Multiple security layers
3. **Immutable Infrastructure**: Containers are immutable
4. **Secrets Management**: Secrets never in images or code
5. **Regular Updates**: Regular security updates
6. **Monitoring**: Security monitoring and alerting
7. **Compliance**: Follow security best practices

## Container Security

### Non-Root Users
All containers run as non-root users:

- **Frontend**: nodejs (UID 1001)
- **Backend**: nodejs (UID 1001)
- **Admin**: nodejs (UID 1001)
- **PostgreSQL**: postgres (UID 999)
- **Worker**: nodejs (UID 1001)

### Read-Only Filesystems
Where possible, containers use read-only filesystems:
- Frontend: Read-only root filesystem
- Backend: Read-only root filesystem (except /tmp, /var/log)
- Admin: Read-only root filesystem

### Resource Limits
All containers have resource limits:
- CPU limits configured
- Memory limits configured
- No privileged mode
- No capabilities added

### Network Security
- Network segmentation (frontend, backend, database, monitoring)
- Internal networks for sensitive services
- No container-to-container communication on default bridge
- Firewall rules (future)

## Image Security

### Base Images
- Use official images when possible
- Use specific version tags (not `latest`)
- Use minimal images (Alpine)
- Regular security scans

### Image Scanning
```bash
# Scan with Trivy
trivy image popcornpicks/backend:latest

# Scan with Docker Scout
docker scout quickview popcornpicks/backend:latest

# Scan with Snyk
snyk test --docker popcornpicks/backend:latest
```

### Build Security
- Multi-stage builds minimize attack surface
- No secrets in build context
- .dockerignore excludes sensitive files
- Signed images (future)

## Secrets Management

### Environment Variables
- Secrets passed as environment variables
- Never commit secrets to repository
- Use separate env files per environment
- Rotate secrets regularly

### Secret Storage
- **Development**: .env files (gitignored)
- **Production**: Docker Secrets or external vault
- **Future**: HashiCorp Vault, AWS Secrets Manager

### Secret Rotation
- Database passwords: Quarterly
- API keys: Quarterly
- JWT secrets: Monthly
- SSL certificates: Before expiration

## Network Security

### Network Segmentation
- **Frontend Network**: Public-facing services
- **Backend Network**: Internal services
- **Database Network**: Database only
- **Monitoring Network**: Monitoring tools

### Firewall Rules
- Default deny all
- Allow required traffic only
- Rate limiting on public endpoints
- IP whitelisting for admin

### TLS/SSL
- HTTPS in production
- TLS 1.2 and 1.3 only
- Strong cipher suites
- Certificate rotation
- HSTS enabled

## Application Security

### Dependencies
- Regular dependency updates
- Security audits (npm audit)
- Vulnerability scanning
- Lock files committed

### Authentication
- JWT-based authentication
- Secure password hashing (bcrypt)
- Session management
- MFA for admin (future)

### Authorization
- Role-based access control (RBAC)
- Row Level Security (RLS) in PostgreSQL
- API rate limiting
- Input validation

## Monitoring

### Security Events
- Failed login attempts
- Unauthorized access attempts
- Unusual traffic patterns
- Container exits
- Resource exhaustion

### Alerting
- Immediate alerts for critical events
- Daily summary of security events
- Weekly security reports
- Monthly security reviews

## Compliance

### Standards
- OWASP Top 10
- CIS Docker Benchmark
- NIST Cybersecurity Framework
- GDPR (data protection)
- PCI DSS (if processing payments)

### Auditing
- Access logs
- Change logs
- Security incident logs
- Regular security audits
- Penetration testing (quarterly)

## Best Practices

1. **Image Updates**: Regularly update base images
2. **Vulnerability Scanning**: Scan images before deployment
3. **Secrets Management**: Never commit secrets
4. **Network Segmentation**: Isolate sensitive services
5. **Resource Limits**: Set limits on all containers
6. **Non-Root**: Run containers as non-root
7. **Read-Only**: Use read-only filesystems where possible
8. **Monitoring**: Monitor security events
9. **Updates**: Apply security updates promptly
10. **Testing**: Test security controls regularly

## Security Checklist

### Before Deployment
- [ ] All containers run as non-root
- [ ] Resource limits configured
- [ ] Secrets not in images
- [ ] TLS/SSL configured
- [ ] Network segmentation implemented
- [ ] Security scanning completed
- [ ] Dependencies updated
- [ ] Firewall rules configured
- [ ] Monitoring configured
- [ ] Backup strategy implemented

### Ongoing
- [ ] Regular security updates
- [ ] Vulnerability scanning
- [ ] Secret rotation
- [ ] Log review
- [ ] Security monitoring
- [ ] Access review
- [ ] Compliance audit
- [ ] Penetration testing
- [ ] Incident response drill
- [ ] Security training

## Incident Response

### Response Plan
1. Detect: Identify security incident
2. Contain: Isolate affected systems
3. Eradicate: Remove threat
4. Recover: Restore from clean backup
5. Post-Mortem: Document and improve

### Contacts
- Security Team: security@popcornpicks.com
- DevOps Team: devops@popcornpicks.com
- Management: exec@popcornpicks.com

### Resources
- Security documentation: /docs/security/
- Incident response plan: /docs/security/incident-response.md
- Contact list: /docs/security/contacts.md
