-- Example view for reviews domain
-- Replace with actual view definitions

CREATE OR REPLACE VIEW reviews.example_view AS
SELECT 
    id,
    name,
    description,
    created_at,
    updated_at
FROM reviews.example
WHERE active = true;

-- Add comment
COMMENT ON VIEW reviews.example_view IS 'View for active example records';

-- Create index on view (materialize if needed)
-- CREATE INDEX idx_example_view_name ON reviews.example_view(name);
