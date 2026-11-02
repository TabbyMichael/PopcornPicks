-- Example view for recommendations domain
-- Replace with actual view definitions

CREATE OR REPLACE VIEW recommendations.example_view AS
SELECT 
    id,
    name,
    description,
    created_at,
    updated_at
FROM recommendations.example
WHERE active = true;

-- Add comment
COMMENT ON VIEW recommendations.example_view IS 'View for active example records';

-- Create index on view (materialize if needed)
-- CREATE INDEX idx_example_view_name ON recommendations.example_view(name);
