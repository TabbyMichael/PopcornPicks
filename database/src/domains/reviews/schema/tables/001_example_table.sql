-- Example table for reviews domain
-- Replace with actual table definitions

CREATE TABLE reviews.example (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE reviews.example IS 'Example table for reviews domain';
COMMENT ON COLUMN reviews.example.id IS 'Primary key';
COMMENT ON COLUMN reviews.example.name IS 'Name field';
COMMENT ON COLUMN reviews.example.description IS 'Description field';
COMMENT ON COLUMN reviews.example.metadata IS 'Additional metadata in JSONB format';
