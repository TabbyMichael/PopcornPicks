-- Example index for system domain
-- Replace with actual index definitions

-- B-tree index for equality and range queries
CREATE INDEX idx_example_name ON system.example(name);

-- GIN index for JSONB searches
CREATE INDEX idx_example_metadata ON system.example USING GIN(metadata);

-- Partial index for common queries
CREATE INDEX idx_example_active ON system.example(id) WHERE active = true;

-- Composite index for multi-column queries
CREATE INDEX idx_example_name_created ON system.example(name, created_at DESC);
