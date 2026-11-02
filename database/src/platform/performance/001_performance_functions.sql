-- ============================================================================
-- Platform Performance Functions
-- Reusable Index maintenance, vacuum/analyze configuration, and performance tuning.
-- ============================================================================

-- ============================================================================
-- Vacuum and Analyze Functions
-- ============================================================================

-- Function to vacuum a specific table
CREATE OR REPLACE FUNCTION platform.vacuum_table(
    p_table_name TEXT,
    p_analyze BOOLEAN DEFAULT true,
    p_full BOOLEAN DEFAULT false,
    p_verbose BOOLEAN DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_sql TEXT;
BEGIN
    v_sql := 'VACUUM';
    
    IF p_full THEN
        v_sql := v_sql || ' FULL';
    END IF;
    
    IF p_analyze THEN
        v_sql := v_sql || ' ANALYZE';
    END IF;
    
    IF p_verbose THEN
        v_sql := v_sql || ' VERBOSE';
    END IF;
    
    v_sql := v_sql || ' ' || p_table_name;
    
    EXECUTE v_sql;
    
    RAISE NOTICE 'Vacuum completed for table %', p_table_name;
END;
$$;

-- Function to vacuum all tables in a schema
CREATE OR REPLACE FUNCTION platform.vacuum_schema(
    p_schema_name TEXT DEFAULT 'public',
    p_analyze BOOLEAN DEFAULT true,
    p_full BOOLEAN DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF p_full THEN
        IF p_analyze THEN
            EXECUTE format('VACUUM FULL ANALYZE %I.*', p_schema_name);
        ELSE
            EXECUTE format('VACUUM FULL %I.*', p_schema_name);
        END IF;
    ELSE
        IF p_analyze THEN
            EXECUTE format('VACUUM ANALYZE %I.*', p_schema_name);
        ELSE
            EXECUTE format('VACUUM %I.*', p_schema_name);
        END IF;
    END IF;
    
    RAISE NOTICE 'Vacuum completed for schema %', p_schema_name;
END;
$$;

-- Function to analyze a specific table
CREATE OR REPLACE FUNCTION platform.analyze_table(p_table_name TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    EXECUTE format('ANALYZE %I', p_table_name);
    RAISE NOTICE 'Analyze completed for table %', p_table_name;
END;
$$;

-- ============================================================================
-- Index Maintenance Functions
-- ============================================================================

-- Function to reindex a specific table
CREATE OR REPLACE FUNCTION platform.reindex_table(p_table_name TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    EXECUTE format('REINDEX TABLE %I', p_table_name);
    RAISE NOTICE 'Reindex completed for table %', p_table_name;
END;
$$;

-- Function to reindex a specific index
CREATE OR REPLACE FUNCTION platform.reindex_index(p_index_name TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    EXECUTE format('REINDEX INDEX %I', p_index_name);
    RAISE NOTICE 'Reindex completed for index %', p_index_name;
END;
$$;

-- Function to reindex a schema
CREATE OR REPLACE FUNCTION platform.reindex_schema(p_schema_name TEXT DEFAULT 'public')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    EXECUTE format('REINDEX SCHEMA %I', p_schema_name);
    RAISE NOTICE 'Reindex completed for schema %', p_schema_name;
END;
$$;

-- Function to reindex database
CREATE OR REPLACE FUNCTION platform.reindex_database()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    REINDEX DATABASE current_database();
    RAISE NOTICE 'Reindex completed for database %', current_database();
END;
$$;

-- Function to get unused indexes
CREATE OR REPLACE FUNCTION platform.get_unused_indexes(p_schema_name TEXT DEFAULT 'public')
RETURNS TABLE(
    table_name TEXT,
    index_name TEXT,
    index_size_bytes BIGINT,
    index_scans BIGINT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    schemaname || '.' || relname as table_name,
    indexrelname as index_name,
    pg_relation_size(indexrelid) as index_size_bytes,
    idx_scan as index_scans
FROM pg_stat_user_indexes
WHERE schemaname = p_schema_name
AND idx_scan = 0
AND indexrelname NOT LIKE '%_pkey'
ORDER BY pg_relation_size(indexrelid) DESC;
$$;

-- Function to get duplicate indexes
CREATE OR REPLACE FUNCTION platform.get_duplicate_indexes(p_schema_name TEXT DEFAULT 'public')
RETURNS TABLE(
    table_name TEXT,
    index_name TEXT,
    duplicate_index TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    i.schemaname || '.' || i.relname as table_name,
    i.indexrelname as index_name,
    j.indexrelname as duplicate_index
FROM pg_stat_user_indexes i
JOIN pg_stat_user_indexes j ON i.relname = j.relname
    AND i.schemaname = j.schemaname
    AND i.indexrelname < j.indexrelname
    AND i.indkey = j.indkey
WHERE i.schemaname = p_schema_name;
$$;

-- ============================================================================
-- Table Bloat Analysis
-- ============================================================================

-- Function to estimate table bloat
CREATE OR REPLACE FUNCTION platform.estimate_table_bloat(p_schema_name TEXT DEFAULT 'public')
RETURNS TABLE(
    table_name TEXT,
    table_size_bytes BIGINT,
    estimated_bloat_bytes BIGINT,
    bloat_percentage NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    schemaname || '.' || tablename as table_name,
    pg_total_relation_size(schemaname || '.' || tablename) as table_size_bytes,
    (pg_total_relation_size(schemaname || '.' || tablename) - 
     (pg_relation_size(schemaname || '.' || tablename) + 
      (COALESCE(pg_total_relation_size(schemaname || '.' || tablename) * 0.1, 0))))::BIGINT as estimated_bloat_bytes,
    ROUND(
        ((pg_total_relation_size(schemaname || '.' || tablename) - 
          (pg_relation_size(schemaname || '.' || tablename) + 
           (COALESCE(pg_total_relation_size(schemaname || '.' || tablename) * 0.1, 0))))::NUMERIC / 
         NULLIF(pg_total_relation_size(schemaname || '.' || tablename), 0)) * 100,
        2
    ) as bloat_percentage
FROM pg_tables
WHERE schemaname = p_schema_name
ORDER BY bloat_percentage DESC;
$$;

-- ============================================================================
-- Missing Indexes Analysis
-- ============================================================================

-- Function to suggest missing indexes based on query patterns
CREATE OR REPLACE FUNCTION platform.suggest_missing_indexes(p_schema_name TEXT DEFAULT 'public')
RETURNS TABLE(
    table_name TEXT,
    column_name TEXT,
    potential_benefit TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
-- This is a simplified version - real implementation would analyze pg_stat_statements
SELECT 
    schemaname || '.' || tablename as table_name,
    attname as column_name,
    'Consider adding index if frequently used in WHERE clauses' as potential_benefit
FROM pg_tables t
JOIN pg_attribute a ON a.attrelid = t.tablename::regclass
WHERE t.schemaname = p_schema_name
AND a.attnum > 0
AND NOT a.attisdropped
AND attname NOT IN (
    SELECT indexrelname 
    FROM pg_stat_user_indexes 
    WHERE schemaname = p_schema_name
)
LIMIT 20;
$$;

-- ============================================================================
-- Configuration Functions
-- ============================================================================

-- Function to get current configuration settings
CREATE OR REPLACE FUNCTION platform.get_config_settings()
RETURNS TABLE(
    setting_name TEXT,
    current_value TEXT,
    default_value TEXT,
    unit TEXT,
    description TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    name as setting_name,
    setting as current_value,
    boot_val as default_value,
    unit,
    short_desc as description
FROM pg_settings
WHERE name IN (
    'shared_buffers',
    'effective_cache_size',
    'maintenance_work_mem',
    'checkpoint_completion_target',
    'wal_buffers',
    'default_statistics_target',
    'random_page_cost',
    'effective_io_concurrency',
    'work_mem',
    'max_connections'
)
ORDER BY name;
$$;

-- Function to get configuration recommendations
CREATE OR REPLACE FUNCTION platform.get_config_recommendations()
RETURNS TABLE(
    setting_name TEXT,
    current_value TEXT,
    recommended_value TEXT,
    reason TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
-- Simplified recommendations - real implementation would be more sophisticated
SELECT 
    name as setting_name,
    setting as current_value,
    CASE 
        WHEN name = 'shared_buffers' THEN '25% of RAM'
        WHEN name = 'effective_cache_size' THEN '75% of RAM'
        WHEN name = 'maintenance_work_mem' THEN '10% of RAM'
        WHEN name = 'checkpoint_completion_target' THEN '0.9'
        WHEN name = 'wal_buffers' THEN '16MB'
        WHEN name = 'default_statistics_target' THEN '100'
        WHEN name = 'random_page_cost' THEN '1.1'
        WHEN name = 'effective_io_concurrency' THEN '200'
        WHEN name = 'work_mem' THEN 'RAM / max_connections / 3'
        ELSE setting
    END as recommended_value,
    'General recommendation - adjust based on workload' as reason
FROM pg_settings
WHERE name IN (
    'shared_buffers',
    'effective_cache_size',
    'maintenance_work_mem',
    'checkpoint_completion_target',
    'wal_buffers',
    'default_statistics_target',
    'random_page_cost',
    'effective_io_concurrency',
    'work_mem',
    'max_connections'
)
ORDER BY name;
$$;

-- ============================================================================
-- Partitioning Helper Functions
-- ============================================================================

-- Function to create partitioned table template
CREATE OR REPLACE FUNCTION platform.create_partitioned_table(
    p_table_name TEXT,
    p_partition_key TEXT,
    p_partition_type TEXT DEFAULT 'RANGE' -- RANGE, LIST, HASH
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_sql TEXT;
BEGIN
    v_sql := format(
        'CREATE TABLE IF NOT EXISTS %I (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), partition_key %s) PARTITION BY %s (%s)',
        p_table_name, 'TEXT', p_partition_type, p_partition_key
    );
    
    EXECUTE v_sql;
    
    RAISE NOTICE 'Created partitioned table % with partition key %', p_table_name, p_partition_key;
END;
$$;

-- Function to create partition
CREATE OR REPLACE FUNCTION platform.create_partition(
    p_parent_table TEXT,
    p_partition_name TEXT,
    p_partition_values TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_sql TEXT;
BEGIN
    v_sql := format(
        'CREATE TABLE IF NOT EXISTS %I PARTITION OF %I FOR VALUES %s',
        p_partition_name, p_parent_table, p_partition_values
    );
    
    EXECUTE v_sql;
    
    RAISE NOTICE 'Created partition % for table %', p_partition_name, p_parent_table;
END;
$$;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON FUNCTION platform.vacuum_table(p_table_name TEXT, p_analyze BOOLEAN, p_full BOOLEAN, p_verbose BOOLEAN) IS 'Vacuum a specific table';
COMMENT ON FUNCTION platform.vacuum_schema(p_schema_name TEXT, p_analyze BOOLEAN, p_full BOOLEAN) IS 'Vacuum all tables in a schema';
COMMENT ON FUNCTION platform.analyze_table(p_table_name TEXT) IS 'Analyze a specific table';
COMMENT ON FUNCTION platform.reindex_table(p_table_name TEXT) IS 'Reindex a specific table';
COMMENT ON FUNCTION platform.reindex_index(p_index_name TEXT) IS 'Reindex a specific index';
COMMENT ON FUNCTION platform.reindex_schema(p_schema_name TEXT) IS 'Reindex a schema';
COMMENT ON FUNCTION platform.reindex_database() IS 'Reindex database';
COMMENT ON FUNCTION platform.get_unused_indexes(p_schema_name TEXT) IS 'Get unused indexes';
COMMENT ON FUNCTION platform.get_duplicate_indexes(p_schema_name TEXT) IS 'Get duplicate indexes';
COMMENT ON FUNCTION platform.estimate_table_bloat(p_schema_name TEXT) IS 'Estimate table bloat';
COMMENT ON FUNCTION platform.suggest_missing_indexes(p_schema_name TEXT) IS 'Suggest missing indexes';
COMMENT ON FUNCTION platform.get_config_settings() IS 'Get current configuration settings';
COMMENT ON FUNCTION platform.get_config_recommendations() IS 'Get configuration recommendations';
COMMENT ON FUNCTION platform.create_partitioned_table(p_table_name TEXT, p_partition_key TEXT, p_partition_type TEXT) IS 'Create partitioned table template';
COMMENT ON FUNCTION platform.create_partition(p_parent_table TEXT, p_partition_name TEXT, p_partition_values TEXT) IS 'Create partition';
