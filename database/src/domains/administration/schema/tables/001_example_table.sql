-- Example table for administration domain
-- Replace with actual table definitions

CREATE TABLE administration.example (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE administration.example IS 'Example table for administration domain';
COMMENT ON COLUMN administration.example.id IS 'Primary key';
COMMENT ON COLUMN administration.example.name IS 'Name field';
COMMENT ON COLUMN administration.example.description IS 'Description field';
COMMENT ON COLUMN administration.example.metadata IS 'Additional metadata in JSONB format';
