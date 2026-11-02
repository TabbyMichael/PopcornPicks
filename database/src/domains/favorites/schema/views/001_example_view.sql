-- Example view for favorites domain
-- Replace with actual view definitions

CREATE OR REPLACE VIEW favorites.example_view AS
SELECT 
    id,
    name,
    description,
    created_at,
    updated_at
FROM favorites.example
WHERE active = true;

-- Add comment
COMMENT ON VIEW favorites.example_view IS 'View for active example records';

-- Create index on view (materialize if needed)
-- CREATE INDEX idx_example_view_name ON favorites.example_view(name);
