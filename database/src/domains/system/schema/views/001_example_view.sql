-- Example view for system domain
-- Replace with actual view definitions

CREATE OR REPLACE VIEW system.example_view AS
SELECT 
    id,
    name,
    description,
    created_at,
    updated_at
FROM system.example
WHERE active = true;

-- Add comment
COMMENT ON VIEW system.example_view IS 'View for active example records';

-- Create index on view (materialize if needed)
-- CREATE INDEX idx_example_view_name ON system.example_view(name);
