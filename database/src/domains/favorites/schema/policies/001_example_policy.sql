-- Example RLS policy for favorites domain
-- Replace with actual policy definitions

-- Enable RLS on table
ALTER TABLE favorites.example ENABLE ROW LEVEL SECURITY;

-- Policy for read access
CREATE POLICY select_example ON favorites.example
FOR SELECT
USING (true);

-- Policy for insert access
CREATE POLICY insert_example ON favorites.example
FOR INSERT
WITH CHECK (true);

-- Policy for update access
CREATE POLICY update_example ON favorites.example
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Policy for delete access
CREATE POLICY delete_example ON favorites.example
FOR DELETE
USING (false); -- No delete by default

-- Add comments
COMMENT ON POLICY select_example ON favorites.example IS 'Allow read access to all authenticated users';
COMMENT ON POLICY insert_example ON favorites.example IS 'Allow insert access to all authenticated users';
COMMENT ON POLICY update_example ON favorites.example IS 'Allow update access to all authenticated users';
COMMENT ON POLICY delete_example ON favorites.example IS 'Deny delete access by default';
