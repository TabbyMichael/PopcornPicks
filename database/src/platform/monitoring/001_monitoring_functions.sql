-- ============================================================================
-- Platform Monitoring Functions
-- Reusable pg_stat_statements views, health check functions, and monitoring utilities.
-- ============================================================================

-- ============================================================================
-- Health Check Functions
-- ============================================================================

-- Function to check database health
CREATE OR REPLACE FUNCTION platform.health_check()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB;
    v_connections INT;
    v_database_size BIGINT;
    v_active_queries INT;
BEGIN
    -- Get connection count
    SELECT COUNT(*) INTO v_connections
    FROM pg_stat_activity
    WHERE datname = current_database();
    
    -- Get database size
    SELECT pg_database_size(current_database()) INTO v_database_size;
    
    -- Get active queries
    SELECT COUNT(*) INTO v_active_queries
    FROM pg_stat_activity
    WHERE datname = current_database()
    AND state = 'active';
    
    -- Build result
    v_result := jsonb_build_object(
        'status', 'healthy',
        'timestamp', NOW(),
        'database', current_database(),
        'connections', v_connections,
        'database_size_bytes', v_database_size,
        'database_size_mb', ROUND(v_database_size::NUMERIC / 1024 / 1024, 2),
        'active_queries', v_active_queries
    );
    
    RETURN v_result;
END;
$$;

-- Function to check extension health
CREATE OR REPLACE FUNCTION platform.extension_health_check()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB;
    v_extensions JSONB;
    v_extension RECORD;
BEGIN
    v_extensions := '{}'::jsonb;
    
    -- Check critical extensions
    FOR v_extension IN
        SELECT extname, default_version, installed_version
        FROM pg_available_extensions
        WHERE extname IN ('pgvector', 'postgis', 'pg_cron', 'pgmq', 'pg_trgm')
    LOOP
        v_extensions := v_extensions || jsonb_build_object(
            v_extension.extname,
            jsonb_build_object(
                'installed', v_extension.installed_version IS NOT NULL,
                'version', COALESCE(v_extension.installed_version, 'not installed')
            )
        );
    END LOOP;
    
    v_result := jsonb_build_object(
        'status', 'healthy',
        'timestamp', NOW(),
        'extensions', v_extensions
    );
    
    RETURN v_result;
END;
$$;

-- ============================================================================
-- Query Performance Monitoring
-- ============================================================================

-- Function to get slow queries
CREATE OR REPLACE FUNCTION platform.get_slow_queries(
    p_threshold_ms INT DEFAULT 1000,
    p_limit INT DEFAULT 20
)
RETURNS TABLE(
    query TEXT,
    calls BIGINT,
    total_time FLOAT,
    mean_time FLOAT,
    max_time FLOAT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    query,
    calls,
    total_exec_time / 1000.0 as total_time,
    mean_exec_time / 1000.0 as mean_time,
    max_exec_time / 1000.0 as max_time
FROM pg_stat_statements
WHERE mean_exec_time > p_threshold_ms
ORDER BY mean_exec_time DESC
LIMIT p_limit;
$$;

-- Function to get most frequent queries
CREATE OR REPLACE FUNCTION platform.get_frequent_queries(p_limit INT DEFAULT 20)
RETURNS TABLE(
    query TEXT,
    calls BIGINT,
    total_time FLOAT,
    mean_time FLOAT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    query,
    calls,
    total_exec_time / 1000.0 as total_time,
    mean_exec_time / 1000.0 as mean_time
FROM pg_stat_statements
ORDER BY calls DESC
LIMIT p_limit;
$$;

-- Function to reset query statistics
CREATE OR REPLACE FUNCTION platform.reset_query_stats()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT pg_stat_statements_reset();
$$;

-- ============================================================================
-- Connection Monitoring
-- ============================================================================

-- Function to get connection statistics
CREATE OR REPLACE FUNCTION platform.get_connection_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB;
    v_total INT;
    v_active INT;
    v_idle INT;
    v_other INT;
BEGIN
    SELECT COUNT(*) INTO v_total FROM pg_stat_activity WHERE datname = current_database();
    SELECT COUNT(*) INTO v_active FROM pg_stat_activity WHERE datname = current_database() AND state = 'active';
    SELECT COUNT(*) INTO v_idle FROM pg_stat_activity WHERE datname = current_database() AND state = 'idle';
    SELECT COUNT(*) INTO v_other FROM pg_stat_activity WHERE datname = current_database() AND state NOT IN ('active', 'idle');
    
    v_result := jsonb_build_object(
        'total', v_total,
        'active', v_active,
        'idle', v_idle,
        'other', v_other,
        'timestamp', NOW()
    );
    
    RETURN v_result;
END;
$$;

-- Function to get long-running queries
CREATE OR REPLACE FUNCTION platform.get_long_running_queries(
    p_threshold_minutes INT DEFAULT 5
)
RETURNS TABLE(
    pid INT,
    query TEXT,
    state TEXT,
    duration_minutes FLOAT,
    user_name TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    pid,
    query,
    state,
    EXTRACT(EPOCH FROM (NOW() - query_start)) / 60.0 as duration_minutes,
    usename as user_name
FROM pg_stat_activity
WHERE datname = current_database()
AND query_start IS NOT NULL
AND NOW() - query_start > (p_threshold_minutes || ' minutes')::INTERVAL
AND state != 'idle'
ORDER BY query_start;
$$;

-- ============================================================================
-- Table Statistics
-- ============================================================================

-- Function to get table sizes
CREATE OR REPLACE FUNCTION platform.get_table_sizes(p_schema_name TEXT DEFAULT 'public')
RETURNS TABLE(
    table_name TEXT,
    row_count BIGINT,
    total_size_bytes BIGINT,
    total_size_mb FLOAT,
    index_size_bytes BIGINT,
    index_size_mb FLOAT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    t.table_name,
    COALESCE(s.n_live_tup, 0) as row_count,
    pg_total_relation_size(schemaname || '.' || tablename) as total_size_bytes,
    ROUND(pg_total_relation_size(schemaname || '.' || tablename)::NUMERIC / 1024 / 1024, 2) as total_size_mb,
    pg_indexes_size(schemaname || '.' || tablename) as index_size_bytes,
    ROUND(pg_indexes_size(schemaname || '.' || tablename)::NUMERIC / 1024 / 1024, 2) as index_size_mb
FROM pg_tables t
LEFT JOIN pg_stat_user_tables s ON t.tablename = s.relname
WHERE t.schemaname = p_schema_name
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC;
$$;

-- Function to get index usage statistics
CREATE OR REPLACE FUNCTION platform.get_index_usage(p_schema_name TEXT DEFAULT 'public')
RETURNS TABLE(
    table_name TEXT,
    index_name TEXT,
    index_scans BIGINT,
    tuples_read BIGINT,
    tuples_fetched BIGINT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    schemaname || '.' || relname as table_name,
    indexrelname as index_name,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = p_schema_name
ORDER BY idx_scan DESC;
$$;

-- ============================================================================
-- Lock Monitoring
-- ============================================================================

-- Function to get current locks
CREATE OR REPLACE FUNCTION platform.get_locks()
RETURNS TABLE(
    pid INT,
    relation TEXT,
    lock_type TEXT,
    mode TEXT,
    granted BOOLEAN,
    query TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    l.pid,
    c.relname as relation,
    l.locktype as lock_type,
    l.mode as mode,
    l.granted,
    a.query
FROM pg_locks l
LEFT JOIN pg_class c ON l.relation = c.oid
LEFT JOIN pg_stat_activity a ON l.pid = a.pid
WHERE l.database = (SELECT oid FROM pg_database WHERE datname = current_database())
ORDER BY l.granted, l.pid;
$$;

-- Function to get blocking locks
CREATE OR REPLACE FUNCTION platform.get_blocking_locks()
RETURNS TABLE(
    blocked_pid INT,
    blocking_pid INT,
    relation TEXT,
    blocked_query TEXT,
    blocking_query TEXT,
    wait_duration INTERVAL
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    blocked_activity.pid as blocked_pid,
    blocking_activity.pid as blocking_pid,
    c.relname as relation,
    blocked_activity.query as blocked_query,
    blocking_activity.query as blocking_query,
    blocked_activity.query_start - blocking_activity.query_start as wait_duration
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.DATABASE IS NOT DISTINCT FROM blocked_locks.DATABASE
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
    AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
    AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
    AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
LEFT JOIN pg_catalog.pg_class c ON blocking_locks.relation = c.oid
WHERE NOT blocked_locks.GRANTED;
$$;

-- ============================================================================
-- Cache Hit Ratio
-- ============================================================================

-- Function to get cache hit ratio
CREATE OR REPLACE FUNCTION platform.get_cache_hit_ratio()
RETURNS TABLE(
    table_name TEXT,
    hit_ratio NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    schemaname || '.' || relname as table_name,
    ROUND(
        (heap_blks_hit::NUMERIC / NULLIF(heap_blks_hit + heap_blks_read, 0)) * 100,
        2
    ) as hit_ratio
FROM pg_stat_user_tables
WHERE heap_blks_read > 0
ORDER BY hit_ratio ASC;
$$;

-- ============================================================================
-- Autovacuum Monitoring
-- ============================================================================

-- Function to get autovacuum status
CREATE OR REPLACE FUNCTION platform.get_autovacuum_status()
RETURNS TABLE(
    table_name TEXT,
    last_autovacuum TIMESTAMPTZ,
    autovacuum_count BIGINT,
    last_autoanalyze TIMESTAMPTZ,
    autoanalyze_count BIGINT,
    dead_tuples BIGINT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    schemaname || '.' || relname as table_name,
    last_autovacuum,
    autovacuum_count,
    last_autoanalyze,
    autoanalyze_count,
    n_dead_tup as dead_tuples
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
$$;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON FUNCTION platform.health_check() IS 'Check database health';
COMMENT ON FUNCTION platform.extension_health_check() IS 'Check extension health';
COMMENT ON FUNCTION platform.get_slow_queries(p_threshold_ms INT, p_limit INT) IS 'Get slow queries';
COMMENT ON FUNCTION platform.get_frequent_queries(p_limit INT) IS 'Get most frequent queries';
COMMENT ON FUNCTION platform.reset_query_stats() IS 'Reset query statistics';
COMMENT ON FUNCTION platform.get_connection_stats() IS 'Get connection statistics';
COMMENT ON FUNCTION platform.get_long_running_queries(p_threshold_minutes INT) IS 'Get long-running queries';
COMMENT ON FUNCTION platform.get_table_sizes(p_schema_name TEXT) IS 'Get table sizes';
COMMENT ON FUNCTION platform.get_index_usage(p_schema_name TEXT) IS 'Get index usage statistics';
COMMENT ON FUNCTION platform.get_locks() IS 'Get current locks';
COMMENT ON FUNCTION platform.get_blocking_locks() IS 'Get blocking locks';
COMMENT ON FUNCTION platform.get_cache_hit_ratio() IS 'Get cache hit ratio';
COMMENT ON FUNCTION platform.get_autovacuum_status() IS 'Get autovacuum status';
