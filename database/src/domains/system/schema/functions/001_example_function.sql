-- Example function for system domain
-- Replace with actual function definitions

-- SQL function example
CREATE OR REPLACE FUNCTION system.get_example_by_id(p_id UUID)
RETURNS system.example
LANGUAGE SQL
STABLE
AS 119317
SELECT * FROM system.example WHERE id = p_id;
119317;

-- Add comment
COMMENT ON FUNCTION system.get_example_by_id IS 'Get example record by ID';

-- PL/pgSQL function example
CREATE OR REPLACE FUNCTION system.create_example(p_name TEXT, p_description TEXT DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
STRICT
AS 119317
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO system.example (name, description)
    VALUES (p_name, p_description)
    RETURNING id INTO v_id;
    
    RETURN v_id;
END;
119317;

-- Add comment
COMMENT ON FUNCTION system.create_example IS 'Create a new example record';
