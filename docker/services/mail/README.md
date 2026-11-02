# Mail Service

## Purpose
The mail service handles email delivery for the PopcornPicks platform. In production, this integrates with an email service provider (SendGrid, AWS SES, etc.). In development, it uses Mailhog for testing.

## Responsibilities
- Transactional email sending
- Email templates
- Delivery tracking
- Bounce handling
- Rate limiting
- Email queue processing

## Configuration
- **Networks**: backend
- **Environment Variables**:
  - `SMTP_HOST`: SMTP server host
  - `SMTP_PORT`: SMTP server port
  - `SMTP_USER`: SMTP username
  - `SMTP_PASSWORD`: SMTP password
  - `SMTP_FROM`: Default from address

## Email Types
- Welcome emails
- Password reset
- Notification emails
- Recommendation emails
- Weekly digest
- System alerts

## Development
- Uses Mailhog for email testing
- All emails captured in web interface
- No external dependencies
- Port: 8025 (web), 1025 (SMTP)

## Production
- Integrates with email service provider
- Delivery tracking and analytics
- Bounce and complaint handling
- Rate limiting per provider
- SPF/DKIM/DMARC configured

## Deployment
- Optional service (can use external provider)
- Containerized for consistency
- Environment-specific configuration

## Security
- SMTP credentials in secrets
- TLS encryption
- IP whitelist
- Rate limiting
- Content security policies

## Monitoring
- Delivery success rates
- Bounce rates
- Spam complaints
- Queue depth
- API response times

## Scaling
- Queue-based processing
- Horizontal scaling possible
- Provider-specific limits
