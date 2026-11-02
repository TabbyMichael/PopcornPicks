# PostgreSQL Service

## Purpose
The PostgreSQL service is the heart of the PopcornPicks platform. It serves as a complete application platform handling persistence, business rules, security, search, scheduling, messaging, analytics, vector search, geospatial queries, auditing, reporting, and background jobs.

## Responsibilities
- Data persistence
- Business logic enforcement
- Row Level Security (RLS)
- Full-text search (pg_trgm)
- Vector search (pgvector)
- Geospatial queries (PostGIS)
- Message queuing (pgmq)
- Job scheduling (pg_cron)
- Real-time notifications (LISTEN/NOTIFY)
- Analytics and reporting
- Audit logging

## Extensions
- pgvector: Vector embeddings and similarity search
- postgis: Geospatial operations
- pg_trgm: Fuzzy text search
- pg_cron: Scheduled jobs
- pgmq: Message queues
- uuid-ossp: UUID generation
- pgcrypto: Cryptographic functions
- citext: Case-insensitive text
- hstore: Key-value storage
- btree_gin: Composite GIN indexes
- btree_gist: Composite GiST indexes
- tablefunc: Crosstab analytics
- ltree: Hierarchical data
- intarray: Integer array operations
- pg_stat_statements: Query performance monitoring

## Configuration
- **Port**: 5432
- **Networks**: backend, database
- **Volumes**: postgres_data, postgres_backups
- **Environment Variables**:
  - `POSTGRES_DB`: Database name
  - `POSTGRES_USER`: Database user
  - `POSTGRES_PASSWORD`: Database password

## Health Check
- Command: `pg_isready -U ${POSTGRES_USER}`
- Interval: 10s (dev), 30s (prod)
- Timeout: 5s (dev), 10s (prod)
- Retries: 5

## Initialization
- Database bootstrap scripts in `/docker-entrypoint-initdb.d`
- Extension installation and configuration
- Schema and role creation
- Seed data application

## Backup Strategy
- Automated daily backups to `/backups`
- Retention policy: 7 daily, 4 weekly, 12 monthly
- Backup validation after creation
- Point-in-time recovery capability

## Security
- Row Level Security on all tables
- Non-root container user
- Network isolation (database network)
- SSL/TLS in production
- Regular security updates

## Performance
- Connection pooling via PgBouncer (future)
- Query optimization via pg_stat_statements
- Appropriate indexing strategy
- Materialized views for analytics
- Connection limits configured
