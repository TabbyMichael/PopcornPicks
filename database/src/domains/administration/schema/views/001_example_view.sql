-- Example view for administration domain
-- Replace with actual view definitions

CREATE OR REPLACE VIEW administration.example_view AS
SELECT 
    id,
    name,
    description,
    created_at,
    updated_at
FROM administration.example
WHERE active = true;

-- Add comment
COMMENT ON VIEW administration.example_view IS 'View for active example records';

-- Create index on view (materialize if needed)
-- CREATE INDEX idx_example_view_name ON administration.example_view(name);
