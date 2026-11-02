# pgvector

Vector similarity search for PostgreSQL.

## Purpose

- Store embeddings (movie descriptions, user preferences, review embeddings)
- Nearest-neighbour queries
- Semantic search
- Recommendation engine

## Usage

- `vector` data type for embeddings
- `<=>` cosine distance, `<->` L2 distance, `<#>` inner product
- IVFFlat and HNSW indexes for approximate nearest-neighbour search

## Configuration

See `configuration.sql`.

## Uninstall

See `uninstall.sql`.