-- ============================================================================
-- Platform Security Functions
-- Reusable RLS helper functions, role definitions, and permission grants.
-- ============================================================================

-- ============================================================================
-- Helper Functions for RLS
-- ============================================================================

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION platform.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM pg_roles 
    WHERE rolname = current_user 
    AND rolname = 'admin'
);
$$;

-- Function to get current user ID from session
CREATE OR REPLACE FUNCTION platform.current_user_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT NULL::UUID; -- TODO: Implement session-based user ID retrieval
$$;

-- Function to check if user owns a record
CREATE OR REPLACE FUNCTION platform.is_record_owner(p_user_id UUID, p_record_user_id UUID)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
SELECT p_user_id = p_record_user_id OR platform.is_admin();
$$;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION platform.has_role(p_role_name TEXT)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM pg_roles 
    WHERE rolname = p_role_name 
    AND pg_has_role(p_role_name, 'MEMBER')
);
$$;

-- ============================================================================
-- Audit Functions
-- ============================================================================

-- Function to log audit events
CREATE OR REPLACE FUNCTION platform.log_audit(
    p_table_name TEXT,
    p_action TEXT,
    p_record_id UUID,
    p_user_id UUID DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO platform.audit_log (
        table_name,
        action,
        record_id,
        user_id,
        old_values,
        new_values,
        timestamp
    ) VALUES (
        p_table_name,
        p_action,
        p_record_id,
        p_user_id,
        p_old_values,
        p_new_values,
        NOW()
    );
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the operation
        RAISE WARNING 'Failed to log audit event: %', SQLERRM;
END;
$$;

-- ============================================================================
-- Permission Helper Functions
-- ============================================================================

-- Function to grant permissions on schema
CREATE OR REPLACE FUNCTION platform.grant_schema_permissions(
    p_role_name TEXT,
    p_schema_name TEXT,
    p_privileges TEXT[] DEFAULT ARRAY['USAGE', 'CREATE']
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    priv TEXT;
BEGIN
    FOREACH priv IN ARRAY p_privileges
    LOOP
        EXECUTE format('GRANT %I ON SCHEMA %I TO %I', priv, p_schema_name, p_role_name);
    END LOOP;
END;
$$;

-- Function to grant permissions on all tables in schema
CREATE OR REPLACE FUNCTION platform.grant_table_permissions(
    p_role_name TEXT,
    p_schema_name TEXT,
    p_privileges TEXT[] DEFAULT ARRAY['SELECT']
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    priv TEXT;
BEGIN
    FOREACH priv IN ARRAY p_privileges
    LOOP
        EXECUTE format('GRANT %I ON ALL TABLES IN SCHEMA %I TO %I', priv, p_schema_name, p_role_name);
    END LOOP;
END;
$$;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON FUNCTION platform.is_admin() IS 'Check if current user is admin';
COMMENT ON FUNCTION platform.current_user_id() IS 'Get current user ID from session';
COMMENT ON FUNCTION platform.is_record_owner(p_user_id UUID, p_record_user_id UUID) IS 'Check if user owns a record or is admin';
COMMENT ON FUNCTION platform.has_role(p_role_name TEXT) IS 'Check if user has specific role';
COMMENT ON FUNCTION platform.log_audit(p_table_name TEXT, p_action TEXT, p_record_id UUID, p_user_id UUID, p_old_values JSONB, p_new_values JSONB) IS 'Log audit events';
COMMENT ON FUNCTION platform.grant_schema_permissions(p_role_name TEXT, p_schema_name TEXT, p_privileges TEXT[]) IS 'Grant permissions on schema';
COMMENT ON FUNCTION platform.grant_table_permissions(p_role_name TEXT, p_schema_name TEXT, p_privileges TEXT[]) IS 'Grant permissions on all tables in schema';
