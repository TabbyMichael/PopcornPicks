-- Example view for movies domain
-- Replace with actual view definitions

CREATE OR REPLACE VIEW movies.example_view AS
SELECT 
    id,
    name,
    description,
    created_at,
    updated_at
FROM movies.example
WHERE active = true;

-- Add comment
COMMENT ON VIEW movies.example_view IS 'View for active example records';

-- Create index on view (materialize if needed)
-- CREATE INDEX idx_example_view_name ON movies.example_view(name);
