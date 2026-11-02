-- Example view for notifications domain
-- Replace with actual view definitions

CREATE OR REPLACE VIEW notifications.example_view AS
SELECT 
    id,
    name,
    description,
    created_at,
    updated_at
FROM notifications.example
WHERE active = true;

-- Add comment
COMMENT ON VIEW notifications.example_view IS 'View for active example records';

-- Create index on view (materialize if needed)
-- CREATE INDEX idx_example_view_name ON notifications.example_view(name);
