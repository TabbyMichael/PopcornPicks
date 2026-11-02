-- Example function for watchlists domain
-- Replace with actual function definitions

-- SQL function example
CREATE OR REPLACE FUNCTION watchlists.get_example_by_id(p_id UUID)
RETURNS watchlists.example
LANGUAGE SQL
STABLE
AS 119317
SELECT * FROM watchlists.example WHERE id = p_id;
119317;

-- Add comment
COMMENT ON FUNCTION watchlists.get_example_by_id IS 'Get example record by ID';

-- PL/pgSQL function example
CREATE OR REPLACE FUNCTION watchlists.create_example(p_name TEXT, p_description TEXT DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
STRICT
AS 119317
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO watchlists.example (name, description)
    VALUES (p_name, p_description)
    RETURNING id INTO v_id;
    
    RETURN v_id;
END;
119317;

-- Add comment
COMMENT ON FUNCTION watchlists.create_example IS 'Create a new example record';
