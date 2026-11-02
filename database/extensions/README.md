# Extensions

PostgreSQL extensions that power the application platform. Each extension lives in its own folder with `README.md`, `install.sql`, `configuration.sql`, and `uninstall.sql`.

## Supported Extensions

| Extension | Purpose | Folder |
| --- | --- | --- |
| `pgvector` | Vector search, embeddings, nearest-neighbour | `pgvector/` |
| `postgis` | Geospatial queries, radius, bounding boxes | `postgis/` |
| `pg_trgm` | Fuzzy text search, trigram indexes | `pg_trgm/` |
| `pg_cron` | Scheduled jobs | `pg_cron/` |
| `pgmq` | Message queues | `pgmq/` |
| `uuid-ossp` | UUID generation | `uuid/` |
| `pgcrypto` | Hashing, encryption | `pgcrypto/` |
| `citext` | Case-insensitive text | `citext/` |
| `hstore` | Key-value storage | `hstore/` |
| `btree_gin` | Composite GIN indexes | `btree_gin/` |
| `btree_gist` | Composite GiST indexes | `btree_gist/` |
| `tablefunc` | Crosstab / pivot analytics | `tablefunc/` |
| `ltree` | Hierarchical data | `ltree/` |
| `intarray` | Integer array operations | `intarray/` |
| `pg_stat_statements` | Query performance monitoring | `pg_stat_statements/` |

## File Conventions

Each extension folder contains:

- `README.md` — purpose, usage, configuration notes
- `install.sql` — `CREATE EXTENSION` statement
- `configuration.sql` — extension-specific configuration
- `uninstall.sql` — `DROP EXTENSION` statement

## Installation

Extensions are installed during bootstrap via `bootstrap/001_extensions.sql`, which references the install scripts in this folder.

## Uninstallation

To remove an extension, run its `uninstall.sql`. Note that dropping an extension may fail if dependent objects exist.