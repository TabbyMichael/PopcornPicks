-- Example view for search domain
-- Replace with actual view definitions

CREATE OR REPLACE VIEW search.example_view AS
SELECT 
    id,
    name,
    description,
    created_at,
    updated_at
FROM search.example
WHERE active = true;

-- Add comment
COMMENT ON VIEW search.example_view IS 'View for active example records';

-- Create index on view (materialize if needed)
-- CREATE INDEX idx_example_view_name ON search.example_view(name);
