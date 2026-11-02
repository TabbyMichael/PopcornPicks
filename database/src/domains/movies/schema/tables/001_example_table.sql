-- Example table for movies domain
-- Replace with actual table definitions

CREATE TABLE movies.example (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE movies.example IS 'Example table for movies domain';
COMMENT ON COLUMN movies.example.id IS 'Primary key';
COMMENT ON COLUMN movies.example.name IS 'Name field';
COMMENT ON COLUMN movies.example.description IS 'Description field';
COMMENT ON COLUMN movies.example.metadata IS 'Additional metadata in JSONB format';
