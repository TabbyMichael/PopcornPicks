-- Example view for authentication domain
-- Replace with actual view definitions

CREATE OR REPLACE VIEW authentication.example_view AS
SELECT 
    id,
    name,
    description,
    created_at,
    updated_at
FROM authentication.example
WHERE active = true;

-- Add comment
COMMENT ON VIEW authentication.example_view IS 'View for active example records';

-- Create index on view (materialize if needed)
-- CREATE INDEX idx_example_view_name ON authentication.example_view(name);
