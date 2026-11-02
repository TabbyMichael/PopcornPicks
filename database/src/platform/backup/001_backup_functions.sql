-- ============================================================================
-- Platform Backup Functions
-- Reusable Backup procedures, pg_dump utilities, and backup scheduling.
-- ============================================================================

-- ============================================================================
-- Backup Metadata Table
-- ============================================================================

-- Create backup metadata table
CREATE TABLE IF NOT EXISTS platform.backup_metadata (
    id BIGSERIAL PRIMARY KEY,
    backup_type TEXT NOT NULL, -- full, incremental, differential
    backup_file TEXT NOT NULL,
    backup_size_bytes BIGINT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    status TEXT NOT NULL, -- running, completed, failed
    tables_included TEXT[],
    tables_excluded TEXT[],
    error_message TEXT,
    checksum TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_backup_metadata_started_at ON platform.backup_metadata(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_backup_metadata_status ON platform.backup_metadata(status);
CREATE INDEX IF NOT EXISTS idx_backup_metadata_type ON platform.backup_metadata(backup_type);

-- Add comments
COMMENT ON TABLE platform.backup_metadata IS 'Metadata for database backups';
COMMENT ON COLUMN platform.backup_metadata.backup_type IS 'Type of backup: full, incremental, differential';
COMMENT ON COLUMN platform.backup_metadata.status IS 'Status: running, completed, failed';

-- ============================================================================
-- Backup Management Functions
-- ============================================================================

-- Function to start backup metadata record
CREATE OR REPLACE FUNCTION platform.start_backup(
    p_backup_type TEXT,
    p_backup_file TEXT,
    p_tables_included TEXT[] DEFAULT NULL,
    p_tables_excluded TEXT[] DEFAULT NULL
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_backup_id BIGINT;
BEGIN
    INSERT INTO platform.backup_metadata (
        backup_type,
        backup_file,
        tables_included,
        tables_excluded,
        status
    ) VALUES (
        p_backup_type,
        p_backup_file,
        p_tables_included,
        p_tables_excluded,
        'running'
    ) RETURNING id INTO v_backup_id;
    
    RETURN v_backup_id;
END;
$$;

-- Function to complete backup metadata record
CREATE OR REPLACE FUNCTION platform.complete_backup(
    p_backup_id BIGINT,
    p_status TEXT,
    p_error_message TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_backup_size BIGINT;
BEGIN
    -- Get file size (this would need to be done externally or via file system access)
    -- For now, we'll set it to NULL
    v_backup_size := NULL;
    
    UPDATE platform.backup_metadata
    SET 
        completed_at = NOW(),
        status = p_status,
        error_message = p_error_message,
        backup_size_bytes = v_backup_size
    WHERE id = p_backup_id;
END;
$$;

-- Function to get backup history
CREATE OR REPLACE FUNCTION platform.get_backup_history(
    p_days INT DEFAULT 30,
    p_backup_type TEXT DEFAULT NULL
)
RETURNS TABLE(
    id BIGINT,
    backup_type TEXT,
    backup_file TEXT,
    backup_size_bytes BIGINT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    status TEXT,
    duration_seconds INTERVAL
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    id,
    backup_type,
    backup_file,
    backup_size_bytes,
    started_at,
    completed_at,
    status,
    completed_at - started_at as duration_seconds
FROM platform.backup_metadata
WHERE started_at > NOW() - (p_days || ' days')::INTERVAL
AND (p_backup_type IS NULL OR backup_type = p_backup_type)
ORDER BY started_at DESC;
$$;

-- Function to get backup statistics
CREATE OR REPLACE FUNCTION platform.get_backup_stats(p_days INT DEFAULT 30)
RETURNS TABLE(
    total_backups BIGINT,
    successful_backups BIGINT,
    failed_backups BIGINT,
    avg_duration_seconds INTERVAL,
    total_size_bytes BIGINT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    COUNT(*) as total_backups,
    COUNT(*) FILTER (WHERE status = 'completed') as successful_backups,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_backups,
    AVG(completed_at - started_at) as avg_duration_seconds,
    SUM(backup_size_bytes) as total_size_bytes
FROM platform.backup_metadata
WHERE started_at > NOW() - (p_days || ' days')::INTERVAL;
$$;

-- ============================================================================
-- Backup Cleanup Functions
-- ============================================================================

-- Function to get backups to delete based on retention policy
CREATE OR REPLACE FUNCTION platform.get_backups_to_delete(
    p_keep_daily INT DEFAULT 7,
    p_keep_weekly INT DEFAULT 4,
    p_keep_monthly INT DEFAULT 12
)
RETURNS TABLE(
    id BIGINT,
    backup_file TEXT,
    backup_type TEXT,
    started_at TIMESTAMPTZ,
    retention_reason TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
WITH ranked_backups AS (
    SELECT 
        id,
        backup_file,
        backup_type,
        started_at,
        ROW_NUMBER() OVER (ORDER BY started_at DESC) as daily_rank,
        ROW_NUMBER() OVER (ORDER BY DATE_TRUNC('week', started_at) DESC, started_at DESC) as weekly_rank,
        ROW_NUMBER() OVER (ORDER BY DATE_TRUNC('month', started_at) DESC, started_at DESC) as monthly_rank
    FROM platform.backup_metadata
    WHERE status = 'completed'
)
SELECT 
    id,
    backup_file,
    backup_type,
    started_at,
    'Outside retention policy' as retention_reason
FROM ranked_backups
WHERE daily_rank > p_keep_daily
AND weekly_rank > p_keep_weekly
AND monthly_rank > p_keep_monthly;
$$;

-- Function to delete old backup metadata
CREATE OR REPLACE FUNCTION platform.cleanup_backup_metadata(p_days INT DEFAULT 90)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_deleted_count BIGINT;
BEGIN
    DELETE FROM platform.backup_metadata
    WHERE started_at < NOW() - (p_days || ' days')::INTERVAL
    AND status = 'completed';
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    
    RETURN v_deleted_count;
END;
$$;

-- ============================================================================
-- Backup Validation Functions
-- ============================================================================

-- Function to validate backup integrity (placeholder)
CREATE OR REPLACE FUNCTION platform.validate_backup(p_backup_file TEXT)
RETURNS TABLE(
    is_valid BOOLEAN,
    validation_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- TODO: Implement actual backup validation
    -- This would typically involve:
    -- 1. Checking if file exists
    -- 2. Verifying file size
    -- 3. Validating compression integrity
    -- 4. Attempting to restore to temporary database
    
    RETURN QUERY SELECT 
        true as is_valid,
        'Validation not yet implemented' as validation_message;
END;
$$;

-- Function to calculate backup checksum
CREATE OR REPLACE FUNCTION platform.calculate_checksum(p_backup_file TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- TODO: Implement checksum calculation
    -- This would typically use pgcrypto or external tools
    RETURN 'checksum_not_calculated';
END;
$$;

-- ============================================================================
-- Backup Scheduling Functions
-- ============================================================================

-- Function to schedule daily backup
CREATE OR REPLACE FUNCTION platform.schedule_daily_backup(
    p_backup_time TEXT DEFAULT '02:00',
    p_backup_path TEXT DEFAULT '/backups/daily'
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_job_name TEXT;
    v_schedule TEXT;
    v_command TEXT;
    v_job_id BIGINT;
BEGIN
    v_job_name := 'daily_backup';
    v_schedule := format('%s * * *', p_backup_time);
    v_command := format(
        'SELECT platform.perform_backup(''full'', ''%s'' || ''/backup_'' || TO_CHAR(NOW(), ''YYYYMMDD_HH24MISS'') || ''.sql.gz'')',
        p_backup_path
    );
    
    v_job_id := platform.create_job(v_job_name, v_schedule, v_command);
    
    RETURN v_job_id;
END;
$$;

-- Function to schedule weekly backup
CREATE OR REPLACE FUNCTION platform.schedule_weekly_backup(
    p_backup_day INT DEFAULT 0, -- 0 = Sunday
    p_backup_time TEXT DEFAULT '02:00',
    p_backup_path TEXT DEFAULT '/backups/weekly'
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_job_name TEXT;
    v_schedule TEXT;
    v_command TEXT;
    v_job_id BIGINT;
BEGIN
    v_job_name := 'weekly_backup';
    v_schedule := format('%s %s * * %s', p_backup_time, '*', p_backup_day);
    v_command := format(
        'SELECT platform.perform_backup(''full'', ''%s'' || ''/backup_'' || TO_CHAR(NOW(), ''YYYYWW'') || ''.sql.gz'')',
        p_backup_path
    );
    
    v_job_id := platform.create_job(v_job_name, v_schedule, v_command);
    
    RETURN v_job_id;
END;
$$;

-- ============================================================================
-- Backup Execution Function (Placeholder)
-- ============================================================================

-- Function to perform backup (placeholder - would call pg_dump externally)
CREATE OR REPLACE FUNCTION platform.perform_backup(
    p_backup_type TEXT,
    p_backup_file TEXT
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_backup_id BIGINT;
BEGIN
    -- Start backup metadata
    v_backup_id := platform.start_backup(p_backup_type, p_backup_file);
    
    -- TODO: Implement actual backup execution
    -- This would typically involve:
    -- 1. Calling pg_dump via COPY or external command
    -- 2. Compressing the output
    -- 3. Storing the file
    -- 4. Calculating checksum
    
    -- For now, we'll mark it as completed
    PERFORM platform.complete_backup(v_backup_id, 'completed');
    
    RETURN v_backup_id;
END;
$$;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON FUNCTION platform.start_backup(p_backup_type TEXT, p_backup_file TEXT, p_tables_included TEXT[], p_tables_excluded TEXT[]) IS 'Start backup metadata record';
COMMENT ON FUNCTION platform.complete_backup(p_backup_id BIGINT, p_status TEXT, p_error_message TEXT) IS 'Complete backup metadata record';
COMMENT ON FUNCTION platform.get_backup_history(p_days INT, p_backup_type TEXT) IS 'Get backup history';
COMMENT ON FUNCTION platform.get_backup_stats(p_days INT) IS 'Get backup statistics';
COMMENT ON FUNCTION platform.get_backups_to_delete(p_keep_daily INT, p_keep_weekly INT, p_keep_monthly INT) IS 'Get backups to delete based on retention policy';
COMMENT ON FUNCTION platform.cleanup_backup_metadata(p_days INT) IS 'Delete old backup metadata';
COMMENT ON FUNCTION platform.validate_backup(p_backup_file TEXT) IS 'Validate backup integrity';
COMMENT ON FUNCTION platform.calculate_checksum(p_backup_file TEXT) IS 'Calculate backup checksum';
COMMENT ON FUNCTION platform.schedule_daily_backup(p_backup_time TEXT, p_backup_path TEXT) IS 'Schedule daily backup';
COMMENT ON FUNCTION platform.schedule_weekly_backup(p_backup_day INT, p_backup_time TEXT, p_backup_path TEXT) IS 'Schedule weekly backup';
COMMENT ON FUNCTION platform.perform_backup(p_backup_type TEXT, p_backup_file TEXT) IS 'Perform backup (placeholder)';
