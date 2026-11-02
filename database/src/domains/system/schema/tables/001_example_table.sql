-- Example table for system domain
-- Replace with actual table definitions

CREATE TABLE system.example (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment
COMMENT ON TABLE system.example IS 'Example table for system domain';
COMMENT ON COLUMN system.example.id IS 'Primary key';
COMMENT ON COLUMN system.example.name IS 'Name field';
COMMENT ON COLUMN system.example.description IS 'Description field';
COMMENT ON COLUMN system.example.metadata IS 'Additional metadata in JSONB format';
