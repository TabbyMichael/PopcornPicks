-- Example view for users domain
-- Replace with actual view definitions

CREATE OR REPLACE VIEW users.example_view AS
SELECT 
    id,
    name,
    description,
    created_at,
    updated_at
FROM users.example
WHERE active = true;

-- Add comment
COMMENT ON VIEW users.example_view IS 'View for active example records';

-- Create index on view (materialize if needed)
-- CREATE INDEX idx_example_view_name ON users.example_view(name);
