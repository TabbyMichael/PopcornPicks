-- ============================================================================
-- Platform Scheduler Functions
-- Reusable pg_cron job definitions for MV refresh, cleanup, TMDB sync, analytics refresh.
-- ============================================================================

-- ============================================================================
-- Job Management Functions
-- ============================================================================

-- Function to create a scheduled job
CREATE OR REPLACE FUNCTION platform.create_job(
    p_job_name TEXT,
    p_schedule TEXT,
    p_command TEXT,
    p_database TEXT DEFAULT CURRENT_DATABASE()
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_job_id BIGINT;
BEGIN
    v_job_id := cron.schedule(p_job_name, p_schedule, p_command, p_database);
    RETURN v_job_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to create job %: %', p_job_name, SQLERRM;
END;
$$;

-- Function to update a scheduled job
CREATE OR REPLACE FUNCTION platform.update_job(
    p_job_name TEXT,
    p_schedule TEXT,
    p_command TEXT
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Drop existing job
    PERFORM cron.unschedule(p_job_name);
    
    -- Create new job with updated parameters
    PERFORM cron.schedule(p_job_name, p_schedule, p_command);
    
    RETURN true;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to update job %: %', p_job_name, SQLERRM;
END;
$$;

-- Function to delete a scheduled job
CREATE OR REPLACE FUNCTION platform.delete_job(
    p_job_name TEXT
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    PERFORM cron.unschedule(p_job_name);
    RETURN true;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Failed to delete job %: %', p_job_name, SQLERRM;
        RETURN false;
END;
$$;

-- Function to get job status
CREATE OR REPLACE FUNCTION platform.get_job_status(p_job_name TEXT)
RETURNS TABLE(
    jobid BIGINT,
    schedule TEXT,
    command TEXT,
    nodename TEXT,
    nodeport INT,
    database TEXT,
    username TEXT,
    active BOOLEAN,
    jobname TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT * FROM cron.job WHERE jobname = p_job_name;
$$;

-- Function to list all jobs
CREATE OR REPLACE FUNCTION platform.list_jobs()
RETURNS TABLE(
    jobid BIGINT,
    jobname TEXT,
    schedule TEXT,
    command TEXT,
    active BOOLEAN,
    last_run TIMESTAMPTZ,
    next_run TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    j.jobid,
    j.jobname,
    j.schedule,
    j.command,
    j.active,
    j.lastrun as last_run,
    j.nextrun as next_run
FROM cron.job j
ORDER BY j.jobname;
$$;

-- ============================================================================
-- Job Execution Logging
-- ============================================================================

-- Create job execution log table
CREATE TABLE IF NOT EXISTS platform.job_execution_log (
    id BIGSERIAL PRIMARY KEY,
    job_name TEXT NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    status TEXT NOT NULL, -- 'running', 'completed', 'failed'
    error_message TEXT,
    duration_seconds INTERVAL
);

-- Create indexes
CREATE INDEX idx_job_execution_log_job_name ON platform.job_execution_log(job_name);
CREATE INDEX idx_job_execution_log_started_at ON platform.job_execution_log(started_at DESC);
CREATE INDEX idx_job_execution_log_status ON platform.job_execution_log(status);

-- Function to log job start
CREATE OR REPLACE FUNCTION platform.log_job_start(p_job_name TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_log_id BIGINT;
BEGIN
    INSERT INTO platform.job_execution_log (job_name, status)
    VALUES (p_job_name, 'running')
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$;

-- Function to log job completion
CREATE OR REPLACE FUNCTION platform.log_job_completion(
    p_log_id BIGINT,
    p_status TEXT,
    p_error_message TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE platform.job_execution_log
    SET 
        completed_at = NOW(),
        status = p_status,
        error_message = p_error_message,
        duration_seconds = NOW() - started_at
    WHERE id = p_log_id;
END;
$$;

-- ============================================================================
-- Job Template Functions
-- ============================================================================

-- Function to create materialized view refresh job
CREATE OR REPLACE FUNCTION platform.create_mv_refresh_job(
    p_mv_name TEXT,
    p_schedule TEXT DEFAULT '0 * * * *', -- Hourly
    p_concurrent BOOLEAN DEFAULT true
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_job_name TEXT;
    v_command TEXT;
    v_job_id BIGINT;
BEGIN
    v_job_name := 'refresh_mv_' || replace(p_mv_name, '.', '_');
    
    IF p_concurrent THEN
        v_command := format('REFRESH MATERIALIZED VIEW CONCURRENTLY %I', p_mv_name);
    ELSE
        v_command := format('REFRESH MATERIALIZED VIEW %I', p_mv_name);
    END IF;
    
    v_job_id := platform.create_job(v_job_name, p_schedule, v_command);
    
    RETURN v_job_id;
END;
$$;

-- Function to create cleanup job
CREATE OR REPLACE FUNCTION platform.create_cleanup_job(
    p_table_name TEXT,
    p_date_column TEXT,
    p_retention_days INT,
    p_schedule TEXT DEFAULT '0 2 * * *' -- Daily at 2 AM
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_job_name TEXT;
    v_command TEXT;
    v_job_id BIGINT;
BEGIN
    v_job_name := 'cleanup_' || replace(p_table_name, '.', '_');
    v_command := format(
        'DELETE FROM %I WHERE %I < NOW() - INTERVAL ''%s days''',
        p_table_name, p_date_column, p_retention_days
    );
    
    v_job_id := platform.create_job(v_job_name, p_schedule, v_command);
    
    RETURN v_job_id;
END;
$$;

-- Function to create statistics update job
CREATE OR REPLACE FUNCTION platform.create_stats_job(
    p_schema_name TEXT DEFAULT 'public',
    p_schedule TEXT DEFAULT '0 3 * * *' -- Daily at 3 AM
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_job_name TEXT;
    v_command TEXT;
    v_job_id BIGINT;
BEGIN
    v_job_name := 'update_stats_' || p_schema_name;
    v_command := format('ANALYZE %I.*', p_schema_name);
    
    v_job_id := platform.create_job(v_job_name, p_schedule, v_command);
    
    RETURN v_job_id;
END;
$$;

-- ============================================================================
-- Job Monitoring Functions
-- ============================================================================

-- Function to get failed jobs
CREATE OR REPLACE FUNCTION platform.get_failed_jobs(p_hours INT DEFAULT 24)
RETURNS TABLE(
    job_name TEXT,
    failure_count BIGINT,
    last_error TEXT,
    last_failed_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    job_name,
    COUNT(*) as failure_count,
    MAX(error_message) as last_error,
    MAX(completed_at) as last_failed_at
FROM platform.job_execution_log
WHERE status = 'failed'
AND completed_at > NOW() - (p_hours || ' hours')::INTERVAL
GROUP BY job_name
ORDER BY failure_count DESC;
$$;

-- Function to get job execution statistics
CREATE OR REPLACE FUNCTION platform.get_job_stats(p_job_name TEXT, p_days INT DEFAULT 7)
RETURNS TABLE(
    total_runs BIGINT,
    successful_runs BIGINT,
    failed_runs BIGINT,
    avg_duration_seconds INTERVAL,
    last_run TIMESTAMPTZ,
    success_rate NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    COUNT(*) as total_runs,
    COUNT(*) FILTER (WHERE status = 'completed') as successful_runs,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_runs,
    AVG(duration_seconds) as avg_duration_seconds,
    MAX(completed_at) as last_run,
    ROUND(
        (COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / NULLIF(COUNT(*), 0)) * 100,
        2
    ) as success_rate
FROM platform.job_execution_log
WHERE job_name = p_job_name
AND started_at > NOW() - (p_days || ' days')::INTERVAL;
$$;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE platform.job_execution_log IS 'Log of job executions for monitoring';
COMMENT ON FUNCTION platform.create_job(p_job_name TEXT, p_schedule TEXT, p_command TEXT, p_database TEXT) IS 'Create a scheduled job';
COMMENT ON FUNCTION platform.update_job(p_job_name TEXT, p_schedule TEXT, p_command TEXT) IS 'Update a scheduled job';
COMMENT ON FUNCTION platform.delete_job(p_job_name TEXT) IS 'Delete a scheduled job';
COMMENT ON FUNCTION platform.get_job_status(p_job_name TEXT) IS 'Get job status';
COMMENT ON FUNCTION platform.list_jobs() IS 'List all scheduled jobs';
COMMENT ON FUNCTION platform.log_job_start(p_job_name TEXT) IS 'Log job start';
COMMENT ON FUNCTION platform.log_job_completion(p_log_id BIGINT, p_status TEXT, p_error_message TEXT) IS 'Log job completion';
COMMENT ON FUNCTION platform.create_mv_refresh_job(p_mv_name TEXT, p_schedule TEXT, p_concurrent BOOLEAN) IS 'Create materialized view refresh job';
COMMENT ON FUNCTION platform.create_cleanup_job(p_table_name TEXT, p_date_column TEXT, p_retention_days INT, p_schedule TEXT) IS 'Create cleanup job';
COMMENT ON FUNCTION platform.create_stats_job(p_schema_name TEXT, p_schedule TEXT) IS 'Create statistics update job';
COMMENT ON FUNCTION platform.get_failed_jobs(p_hours INT) IS 'Get failed jobs in specified time period';
COMMENT ON FUNCTION platform.get_job_stats(p_job_name TEXT, p_days INT) IS 'Get job execution statistics';
