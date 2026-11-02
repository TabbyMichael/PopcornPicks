-- Example table for search domain
-- Replace with actual table definitions

CREATE TABLE search.example (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE search.example IS 'Example table for search domain';
COMMENT ON COLUMN search.example.id IS 'Primary key';
COMMENT ON COLUMN search.example.name IS 'Name field';
COMMENT ON COLUMN search.example.description IS 'Description field';
COMMENT ON COLUMN search.example.metadata IS 'Additional metadata in JSONB format';
