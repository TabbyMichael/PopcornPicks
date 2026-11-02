-- Example view for ratings domain
-- Replace with actual view definitions

CREATE OR REPLACE VIEW ratings.example_view AS
SELECT 
    id,
    name,
    description,
    created_at,
    updated_at
FROM ratings.example
WHERE active = true;

-- Add comment
COMMENT ON VIEW ratings.example_view IS 'View for active example records';

-- Create index on view (materialize if needed)
-- CREATE INDEX idx_example_view_name ON ratings.example_view(name);
