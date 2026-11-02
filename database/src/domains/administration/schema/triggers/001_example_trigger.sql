-- Example trigger for administration domain
-- Replace with actual trigger definitions

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION administration.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS 119317
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
119317;

-- Trigger to automatically update updated_at
CREATE TRIGGER trg_example_updated_at
BEFORE UPDATE ON administration.example
FOR EACH ROW
EXECUTE FUNCTION administration.update_updated_at();

-- Add comment
COMMENT ON TRIGGER trg_example_updated_at ON administration.example IS 'Automatically update updated_at timestamp';
