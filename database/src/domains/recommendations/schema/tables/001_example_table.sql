-- Example table for recommendations domain
-- Replace with actual table definitions

CREATE TABLE recommendations.example (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE recommendations.example IS 'Example table for recommendations domain';
COMMENT ON COLUMN recommendations.example.id IS 'Primary key';
COMMENT ON COLUMN recommendations.example.name IS 'Name field';
COMMENT ON COLUMN recommendations.example.description IS 'Description field';
COMMENT ON COLUMN recommendations.example.metadata IS 'Additional metadata in JSONB format';
