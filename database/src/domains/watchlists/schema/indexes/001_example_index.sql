-- Example index for watchlists domain
-- Replace with actual index definitions

-- B-tree index for equality and range queries
CREATE INDEX idx_example_name ON watchlists.example(name);

-- GIN index for JSONB searches
CREATE INDEX idx_example_metadata ON watchlists.example USING GIN(metadata);

-- Partial index for common queries
CREATE INDEX idx_example_active ON watchlists.example(id) WHERE active = true;

-- Composite index for multi-column queries
CREATE INDEX idx_example_name_created ON watchlists.example(name, created_at DESC);
