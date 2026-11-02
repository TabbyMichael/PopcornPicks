-- Example table for authentication domain
-- Replace with actual table definitions

CREATE TABLE authentication.example (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE authentication.example IS 'Example table for authentication domain';
COMMENT ON COLUMN authentication.example.id IS 'Primary key';
COMMENT ON COLUMN authentication.example.name IS 'Name field';
COMMENT ON COLUMN authentication.example.description IS 'Description field';
COMMENT ON COLUMN authentication.example.metadata IS 'Additional metadata in JSONB format';
