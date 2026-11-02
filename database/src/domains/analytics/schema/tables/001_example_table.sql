-- Example table for analytics domain
-- Replace with actual table definitions

CREATE TABLE analytics.example (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE analytics.example IS 'Example table for analytics domain';
COMMENT ON COLUMN analytics.example.id IS 'Primary key';
COMMENT ON COLUMN analytics.example.name IS 'Name field';
COMMENT ON COLUMN analytics.example.description IS 'Description field';
COMMENT ON COLUMN analytics.example.metadata IS 'Additional metadata in JSONB format';
