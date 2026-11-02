-- Example view for watchlists domain
-- Replace with actual view definitions

CREATE OR REPLACE VIEW watchlists.example_view AS
SELECT 
    id,
    name,
    description,
    created_at,
    updated_at
FROM watchlists.example
WHERE active = true;

-- Add comment
COMMENT ON VIEW watchlists.example_view IS 'View for active example records';

-- Create index on view (materialize if needed)
-- CREATE INDEX idx_example_view_name ON watchlists.example_view(name);
