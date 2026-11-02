# PostgreSQL Dockerfile with all required extensions
# Base: Official PostgreSQL with PostGIS

FROM postgis/postgis:16-3.4-alpine

# Install additional extensions
RUN apk add --no-cache \
    postgresql-16-pgvector \
    postgresql-16-pgcron \
    postgresql-16-pgmq \
    postgresql-16-pgtrgm \
    postgresql-16-hstore \
    postgresql-16-intarray \
    postgresql-16-ltree \
    postgresql-16-tablefunc \
    postgresql-16-btree-gin \
    postgresql-16-btree-gist \
    postgresql-16-pgstatstatements

# Create directory for custom scripts
RUN mkdir -p /docker-entrypoint-initdb.d

# Copy initialization scripts
COPY database/bootstrap/ /docker-entrypoint-initdb.d/
COPY database/extensions/ /usr/share/postgresql/16/extensions/

# Set permissions
RUN chmod -R 755 /docker-entrypoint-initdb.d

# Add healthcheck script
COPY healthcheck.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/healthcheck.sh

# Expose PostgreSQL port
EXPOSE 5432

# Set default data directory
ENV PGDATA=/var/lib/postgresql/data

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=5 \
    CMD pg_isready -U ${POSTGRES_USER} || exit 1

# Run as non-root user
USER postgres

# Start PostgreSQL
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["postgres"]
