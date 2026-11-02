-- Example table for favorites domain
-- Replace with actual table definitions

CREATE TABLE favorites.example (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE favorites.example IS 'Example table for favorites domain';
COMMENT ON COLUMN favorites.example.id IS 'Primary key';
COMMENT ON COLUMN favorites.example.name IS 'Name field';
COMMENT ON COLUMN favorites.example.description IS 'Description field';
COMMENT ON COLUMN favorites.example.metadata IS 'Additional metadata in JSONB format';
