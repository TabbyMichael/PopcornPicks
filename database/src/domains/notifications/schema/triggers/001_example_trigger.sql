-- Example trigger for notifications domain
-- Replace with actual trigger definitions

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION notifications.update_updated_at()
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
BEFORE UPDATE ON notifications.example
FOR EACH ROW
EXECUTE FUNCTION notifications.update_updated_at();

-- Add comment
COMMENT ON TRIGGER trg_example_updated_at ON notifications.example IS 'Automatically update updated_at timestamp';
