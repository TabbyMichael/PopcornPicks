-- ============================================================================
-- Platform Audit Functions
-- Reusable Audit table template, audit trigger function, history table pattern.
-- ============================================================================

-- ============================================================================
-- Audit Log Table
-- ============================================================================

-- Create audit log table if not exists
CREATE TABLE IF NOT EXISTS platform.audit_log (
    id BIGSERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    action TEXT NOT NULL, -- INSERT, UPDATE, DELETE
    record_id UUID NOT NULL,
    user_id UUID,
    old_values JSONB,
    new_values JSONB,
    changed_columns TEXT[],
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON platform.audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_record_id ON platform.audit_log(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON platform.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON platform.audit_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON platform.audit_log(action);

-- Add comments
COMMENT ON TABLE platform.audit_log IS 'Central audit log for all table changes';
COMMENT ON COLUMN platform.audit_log.action IS 'Type of action: INSERT, UPDATE, DELETE';
COMMENT ON COLUMN platform.audit_log.old_values IS 'Previous values for UPDATE/DELETE';
COMMENT ON COLUMN platform.audit_log.new_values IS 'New values for INSERT/UPDATE';
COMMENT ON COLUMN platform.audit_log.changed_columns IS 'List of columns that changed';

-- ============================================================================
-- Audit Trigger Function
-- ============================================================================

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION platform.audit_trigger_func()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_old_values JSONB;
    v_new_values JSONB;
    v_changed_columns TEXT[];
    v_column_name TEXT;
BEGIN
    -- Determine action type
    IF TG_OP = 'DELETE' THEN
        v_old_values := to_jsonb(OLD);
        v_new_values := NULL;
    ELSIF TG_OP = 'UPDATE' THEN
        v_old_values := to_jsonb(OLD);
        v_new_values := to_jsonb(NEW);
        
        -- Identify changed columns
        FOR v_column_name IN
            SELECT jsonb_object_keys(v_old_values)
        LOOP
            IF v_old_values->v_column_name IS DISTINCT FROM v_new_values->v_column_name THEN
                v_changed_columns := array_append(v_changed_columns, v_column_name);
            END IF;
        END LOOP;
    ELSIF TG_OP = 'INSERT' THEN
        v_old_values := NULL;
        v_new_values := to_jsonb(NEW);
    END IF;
    
    -- Insert audit log entry
    INSERT INTO platform.audit_log (
        table_name,
        action,
        record_id,
        user_id,
        old_values,
        new_values,
        changed_columns
    ) VALUES (
        TG_TABLE_NAME,
        TG_OP,
        COALESCE(NEW.id, OLD.id),
        platform.current_user_id(),
        v_old_values,
        v_new_values,
        v_changed_columns
    );
    
    -- Return appropriate value based on operation
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the operation
        RAISE WARNING 'Audit trigger failed for %.%: %', TG_TABLE_NAME, TG_OP, SQLERRM;
        
        IF TG_OP = 'DELETE' THEN
            RETURN OLD;
        ELSE
            RETURN NEW;
        END IF;
END;
$$;

-- ============================================================================
-- Audit Trigger Management Functions
-- ============================================================================

-- Function to add audit trigger to a table
CREATE OR REPLACE FUNCTION platform.add_audit_trigger(p_table_name TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_trigger_name TEXT;
BEGIN
    v_trigger_name := 'trg_audit_' || p_table_name;
    
    -- Drop trigger if exists
    DROP TRIGGER IF EXISTS v_trigger_name ON p_table_name;
    
    -- Create trigger
    EXECUTE format(
        'CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE ON %I
         FOR EACH ROW EXECUTE FUNCTION platform.audit_trigger_func()',
        v_trigger_name, p_table_name
    );
    
    RAISE NOTICE 'Added audit trigger to table %', p_table_name;
END;
$$;

-- Function to remove audit trigger from a table
CREATE OR REPLACE FUNCTION platform.remove_audit_trigger(p_table_name TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_trigger_name TEXT;
BEGIN
    v_trigger_name := 'trg_audit_' || p_table_name;
    
    -- Drop trigger
    DROP TRIGGER IF EXISTS v_trigger_name ON p_table_name;
    
    RAISE NOTICE 'Removed audit trigger from table %', p_table_name;
END;
$$;

-- ============================================================================
-- History Table Pattern
-- ============================================================================

-- Function to create history table for a table
CREATE OR REPLACE FUNCTION platform.create_history_table(
    p_source_table TEXT,
    p_schema_name TEXT DEFAULT 'public'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_history_table TEXT;
    v_sql TEXT;
BEGIN
    v_history_table := p_source_table || '_history';
    
    -- Create history table
    v_sql := format(
        'CREATE TABLE IF NOT EXISTS %I.%I (LIKE %I.%I INCLUDING DEFAULTS INCLUDING CONSTRAINTS)',
        p_schema_name, v_history_table, p_schema_name, p_source_table
    );
    EXECUTE v_sql;
    
    -- Add history-specific columns
    EXECUTE format(
        'ALTER TABLE %I.%I ADD COLUMN IF NOT EXISTS history_id BIGSERIAL PRIMARY KEY',
        p_schema_name, v_history_table
    );
    
    EXECUTE format(
        'ALTER TABLE %I.%I ADD COLUMN IF NOT EXISTS history_action TEXT NOT NULL',
        p_schema_name, v_history_table
    );
    
    EXECUTE format(
        'ALTER TABLE %I.%I ADD COLUMN IF NOT EXISTS history_timestamp TIMESTAMPTZ DEFAULT NOW()',
        p_schema_name, v_history_table
    );
    
    EXECUTE format(
        'ALTER TABLE %I.%I ADD COLUMN IF NOT EXISTS history_user_id UUID',
        p_schema_name, v_history_table
    );
    
    -- Create indexes
    EXECUTE format(
        'CREATE INDEX IF NOT EXISTS idx_%s_history_id ON %I.%I(id)',
        v_history_table, p_schema_name, v_history_table
    );
    
    EXECUTE format(
        'CREATE INDEX IF NOT EXISTS idx_%s_history_timestamp ON %I.%I(history_timestamp DESC)',
        v_history_table, p_schema_name, v_history_table
    );
    
    RAISE NOTICE 'Created history table % for %', v_history_table, p_source_table;
END;
$$;

-- Function to add history trigger to a table
CREATE OR REPLACE FUNCTION platform.add_history_trigger(p_table_name TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_history_table TEXT;
    v_trigger_name TEXT;
BEGIN
    v_history_table := p_table_name || '_history';
    v_trigger_name := 'trg_history_' || p_table_name;
    
    -- Create history table if not exists
    PERFORM platform.create_history_table(p_table_name);
    
    -- Drop trigger if exists
    DROP TRIGGER IF EXISTS v_trigger_name ON p_table_name;
    
    -- Create trigger
    EXECUTE format(
        'CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE ON %I
         FOR EACH ROW EXECUTE FUNCTION platform.history_trigger_func()',
        v_trigger_name, p_table_name
    );
    
    RAISE NOTICE 'Added history trigger to table %', p_table_name;
END;
$$;

-- History trigger function
CREATE OR REPLACE FUNCTION platform.history_trigger_func()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_history_table TEXT;
    v_sql TEXT;
BEGIN
    v_history_table := TG_TABLE_NAME || '_history';
    
    IF TG_OP = 'DELETE' THEN
        v_sql := format(
            'INSERT INTO %I SELECT $1.*, ''DELETE'', NOW(), $2',
            v_history_table
        );
        EXECUTE v_sql USING OLD, platform.current_user_id();
    ELSIF TG_OP = 'UPDATE' THEN
        v_sql := format(
            'INSERT INTO %I SELECT $1.*, ''UPDATE'', NOW(), $2',
            v_history_table
        );
        EXECUTE v_sql USING NEW, platform.current_user_id();
    ELSIF TG_OP = 'INSERT' THEN
        v_sql := format(
            'INSERT INTO %I SELECT $1.*, ''INSERT'', NOW(), $2',
            v_history_table
        );
        EXECUTE v_sql USING NEW, platform.current_user_id();
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

-- ============================================================================
-- Audit Query Functions
-- ============================================================================

-- Function to get audit history for a record
CREATE OR REPLACE FUNCTION platform.get_record_history(
    p_table_name TEXT,
    p_record_id UUID
)
RETURNS TABLE(
    id BIGINT,
    action TEXT,
    user_id UUID,
    old_values JSONB,
    new_values JSONB,
    changed_columns TEXT[],
    timestamp TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    id,
    action,
    user_id,
    old_values,
    new_values,
    changed_columns,
    timestamp
FROM platform.audit_log
WHERE table_name = p_table_name
AND record_id = p_record_id
ORDER BY timestamp DESC;
$$;

-- Function to get audit history for a user
CREATE OR REPLACE FUNCTION platform.get_user_history(
    p_user_id UUID,
    p_limit INT DEFAULT 100
)
RETURNS TABLE(
    id BIGINT,
    table_name TEXT,
    action TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    timestamp TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    id,
    table_name,
    action,
    record_id,
    old_values,
    new_values,
    timestamp
FROM platform.audit_log
WHERE user_id = p_user_id
ORDER BY timestamp DESC
LIMIT p_limit;
$$;

-- Function to get recent audit entries
CREATE OR REPLACE FUNCTION platform.get_recent_audit_entries(
    p_limit INT DEFAULT 50,
    p_table_name TEXT DEFAULT NULL
)
RETURNS TABLE(
    id BIGINT,
    table_name TEXT,
    action TEXT,
    record_id UUID,
    user_id UUID,
    timestamp TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    id,
    table_name,
    action,
    record_id,
    user_id,
    timestamp
FROM platform.audit_log
WHERE p_table_name IS NULL OR table_name = p_table_name
ORDER BY timestamp DESC
LIMIT p_limit;
$$;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON FUNCTION platform.audit_trigger_func() IS 'Generic audit trigger function';
COMMENT ON FUNCTION platform.add_audit_trigger(p_table_name TEXT) IS 'Add audit trigger to a table';
COMMENT ON FUNCTION platform.remove_audit_trigger(p_table_name TEXT) IS 'Remove audit trigger from a table';
COMMENT ON FUNCTION platform.create_history_table(p_source_table TEXT, p_schema_name TEXT) IS 'Create history table for a table';
COMMENT ON FUNCTION platform.add_history_trigger(p_table_name TEXT) IS 'Add history trigger to a table';
COMMENT ON FUNCTION platform.history_trigger_func() IS 'History trigger function';
COMMENT ON FUNCTION platform.get_record_history(p_table_name TEXT, p_record_id UUID) IS 'Get audit history for a record';
COMMENT ON FUNCTION platform.get_user_history(p_user_id UUID, p_limit INT) IS 'Get audit history for a user';
COMMENT ON FUNCTION platform.get_recent_audit_entries(p_limit INT, p_table_name TEXT) IS 'Get recent audit entries';
