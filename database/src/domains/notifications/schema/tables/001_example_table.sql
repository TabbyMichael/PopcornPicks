-- Example table for notifications domain
-- Replace with actual table definitions

CREATE TABLE notifications.example (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE notifications.example IS 'Example table for notifications domain';
COMMENT ON COLUMN notifications.example.id IS 'Primary key';
COMMENT ON COLUMN notifications.example.name IS 'Name field';
COMMENT ON COLUMN notifications.example.description IS 'Description field';
COMMENT ON COLUMN notifications.example.metadata IS 'Additional metadata in JSONB format';
