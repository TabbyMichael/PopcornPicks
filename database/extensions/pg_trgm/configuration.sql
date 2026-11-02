-- ============================================================================
-- pg_trgm configuration.sql
-- Configure pg_trgm for optimal performance.
-- ============================================================================

-- Recommended GIN trigram index for fuzzy search:
--   CREATE INDEX idx_movie_title_trgm
--     ON movies.movie
--     USING gin (title gin_trgm_ops);

-- Similarity threshold (0.0 - 1.0). Lower = more matches, more noise.
-- SET pg_trgm.similarity_threshold = 0.3;

-- Word similarity threshold for word_similarity().
-- SET pg_trgm.word_similarity_threshold = 0.6;

-- Common operators:
--   title % 'query'          - similarity match
--   title ILIKE '%query%'    - substring match (accelerated by GIN trgm index)