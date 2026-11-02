-- Example table for watchlists domain
-- Replace with actual table definitions

CREATE TABLE watchlists.example (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE watchlists.example IS 'Example table for watchlists domain';
COMMENT ON COLUMN watchlists.example.id IS 'Primary key';
COMMENT ON COLUMN watchlists.example.name IS 'Name field';
COMMENT ON COLUMN watchlists.example.description IS 'Description field';
COMMENT ON COLUMN watchlists.example.metadata IS 'Additional metadata in JSONB format';
