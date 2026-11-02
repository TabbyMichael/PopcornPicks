-- Example table for ratings domain
-- Replace with actual table definitions

CREATE TABLE ratings.example (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE ratings.example IS 'Example table for ratings domain';
COMMENT ON COLUMN ratings.example.id IS 'Primary key';
COMMENT ON COLUMN ratings.example.name IS 'Name field';
COMMENT ON COLUMN ratings.example.description IS 'Description field';
COMMENT ON COLUMN ratings.example.metadata IS 'Additional metadata in JSONB format';
