-- Example view for analytics domain
-- Replace with actual view definitions

CREATE OR REPLACE VIEW analytics.example_view AS
SELECT 
    id,
    name,
    description,
    created_at,
    updated_at
FROM analytics.example
WHERE active = true;

-- Add comment
COMMENT ON VIEW analytics.example_view IS 'View for active example records';

-- Create index on view (materialize if needed)
-- CREATE INDEX idx_example_view_name ON analytics.example_view(name);
