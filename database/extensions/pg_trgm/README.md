# pg_trgm

Trigram-based fuzzy text search for PostgreSQL.

## Purpose

- Fuzzy text search (LIKE / ILIKE acceleration)
- Similarity search (`similarity()`, `word_similarity()`)
- Autocomplete / typo tolerance
- GIN and GiST trigram indexes

## Usage

- `%` operator for similarity
- `similarity(text, text)` function
- GIN trigram indexes for fast fuzzy search

## Configuration

See `configuration.sql`.

## Uninstall

See `uninstall.sql`.