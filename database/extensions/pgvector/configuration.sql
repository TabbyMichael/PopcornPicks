-- ============================================================================
-- pgvector configuration.sql
-- Configure pgvector for optimal performance.
-- ============================================================================

-- Enable HNSW index support (default in pgvector 0.5+)
-- HNSW provides better recall than IVFFlat for approximate nearest-neighbour.

-- Recommended index parameters:
--   HNSW:  m = 16, ef_construction = 64
--   IVFFlat: lists = sqrt(rows) for approximate search

-- Example HNSW index (used in domain schema):
--   CREATE INDEX idx_movie_embedding_hnsw
--     ON movies.movie_embedding
--     USING hnsw (embedding vector_cosine_ops)
--     WITH (m = 16, ef_construction = 64);

-- Example IVFFlat index:
--   CREATE INDEX idx_movie_embedding_ivfflat
--     ON movies.movie_embedding
--     USING ivfflat (embedding vector_cosine_ops)
--     WITH (lists = 100);

-- Distance operators:
--   <=>  cosine distance (recommended for text embeddings)
--   <->  L2 / Euclidean distance
--   <#>  inner product (negative dot product)