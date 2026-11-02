-- Example index for analytics domain
-- Replace with actual index definitions

-- B-tree index for equality and range queries
CREATE INDEX idx_example_name ON analytics.example(name);

-- GIN index for JSONB searches
CREATE INDEX idx_example_metadata ON analytics.example USING GIN(metadata);

-- Partial index for common queries
CREATE INDEX idx_example_active ON analytics.example(id) WHERE active = true;

-- Composite index for multi-column queries
CREATE INDEX idx_example_name_created ON analytics.example(name, created_at DESC);
