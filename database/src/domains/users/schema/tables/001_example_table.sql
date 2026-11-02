-- Example table for users domain
-- Replace with actual table definitions

CREATE TABLE users.example (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE users.example IS 'Example table for users domain';
COMMENT ON COLUMN users.example.id IS 'Primary key';
COMMENT ON COLUMN users.example.name IS 'Name field';
COMMENT ON COLUMN users.example.description IS 'Description field';
COMMENT ON COLUMN users.example.metadata IS 'Additional metadata in JSONB format';
