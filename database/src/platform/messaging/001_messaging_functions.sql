-- ============================================================================
-- Platform Messaging Functions
-- Reusable pgmq queue creation, LISTEN/NOTIFY channel definitions, and messaging patterns.
-- ============================================================================

-- ============================================================================
-- pgmq Queue Management Functions
-- ============================================================================

-- Function to create a queue with standard configuration
CREATE OR REPLACE FUNCTION platform.create_queue(
    p_queue_name TEXT,
    p_retention_interval INT DEFAULT 86400, -- 24 hours
    p_message_group_id INT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Create the queue using pgmq
    IF p_message_group_id IS NULL THEN
        PERFORM pgmq.create(p_queue_name, p_retention_interval);
    ELSE
        PERFORM pgmq.create(p_queue_name, p_retention_interval, p_message_group_id);
    END IF;
    
    -- Grant permissions to application role
    GRANT USAGE ON SCHEMA pgmq TO application;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA pgmq TO application;
    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA pgmq TO application;
    
EXCEPTION
    WHEN duplicate_table THEN
        RAISE NOTICE 'Queue % already exists', p_queue_name;
END;
$$;

-- Function to send a message to a queue
CREATE OR REPLACE FUNCTION platform.send_message(
    p_queue_name TEXT,
    p_message JSONB,
    p_delay INT DEFAULT 0
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_message_id BIGINT;
BEGIN
    v_message_id := pgmq.send(p_queue_name, p_message, p_delay);
    RETURN v_message_id;
END;
$$;

-- Function to read a message from a queue
CREATE OR REPLACE FUNCTION platform.read_message(
    p_queue_name TEXT,
    p_max_count INT DEFAULT 1,
    p_visibility_timeout INT DEFAULT 30
)
RETURNS SETOF pgmq.read_queue_type
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT * FROM pgmq.read(p_queue_name, p_max_count, p_visibility_timeout);
$$;

-- Function to delete a message from a queue
CREATE OR REPLACE FUNCTION platform.delete_message(
    p_queue_name TEXT,
    p_message_id BIGINT
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    PERFORM pgmq.delete(p_queue_name, p_message_id);
    RETURN true;
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$;

-- Function to archive a queue
CREATE OR REPLACE FUNCTION platform.archive_queue(
    p_queue_name TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    PERFORM pgmq.archive(p_queue_name);
END;
$$;

-- Function to drop a queue
CREATE OR REPLACE FUNCTION platform.drop_queue(
    p_queue_name TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    PERFORM pgmq.drop(p_queue_name);
END;
$$;

-- ============================================================================
-- LISTEN/NOTIFY Functions
-- ============================================================================

-- Function to notify an event
CREATE OR REPLACE FUNCTION platform.notify_event(
    p_channel TEXT,
    p_payload JSONB
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    PERFORM pg_notify(p_channel, p_payload::text);
END;
$$;

-- Function to notify with structured event data
CREATE OR REPLACE FUNCTION platform.notify_structured_event(
    p_channel TEXT,
    p_event_type TEXT,
    p_entity_type TEXT,
    p_entity_id UUID,
    p_additional_data JSONB DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_payload JSONB;
BEGIN
    v_payload := jsonb_build_object(
        'event_type', p_event_type,
        'entity_type', p_entity_type,
        'entity_id', p_entity_id,
        'timestamp', NOW(),
        'data', p_additional_data
    );
    
    PERFORM pg_notify(p_channel, v_payload::text);
END;
$$;

-- ============================================================================
-- Dead Letter Queue Functions
-- ============================================================================

-- Function to move failed message to dead letter queue
CREATE OR REPLACE FUNCTION platform.move_to_dlq(
    p_queue_name TEXT,
    p_message_id BIGINT,
    p_error_message TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_message JSONB;
BEGIN
    -- Read the message
    SELECT msg INTO v_message
    FROM pgmq.read(p_queue_name, 1, 0)
    WHERE msg_id = p_message_id;
    
    IF v_message IS NOT NULL THEN
        -- Add error information
        v_message := v_message || jsonb_build_object(
            'error', p_error_message,
            'failed_at', NOW(),
            'original_queue', p_queue_name
        );
        
        -- Send to dead letter queue
        PERFORM platform.send_message(p_queue_name || '_dlq', v_message);
        
        -- Delete from original queue
        PERFORM platform.delete_message(p_queue_name, p_message_id);
    END IF;
END;
$$;

-- ============================================================================
-- Queue Monitoring Functions
-- ============================================================================

-- Function to get queue statistics
CREATE OR REPLACE FUNCTION platform.get_queue_stats(p_queue_name TEXT)
RETURNS TABLE(
    queue_name TEXT,
    message_count BIGINT,
    oldest_message TIMESTAMPTZ,
    newest_message TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $$
SELECT 
    p_queue_name as queue_name,
    COUNT(*) as message_count,
    MIN(enqueued_at) as oldest_message,
    MAX(enqueued_at) as newest_message
FROM pgmq.q_${p_queue_name}
GROUP BY p_queue_name;
$$;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON FUNCTION platform.create_queue(p_queue_name TEXT, p_retention_interval INT, p_message_group_id INT) IS 'Create a pgmq queue with standard configuration';
COMMENT ON FUNCTION platform.send_message(p_queue_name TEXT, p_message JSONB, p_delay INT) IS 'Send a message to a queue';
COMMENT ON FUNCTION platform.read_message(p_queue_name TEXT, p_max_count INT, p_visibility_timeout INT) IS 'Read messages from a queue';
COMMENT ON FUNCTION platform.delete_message(p_queue_name TEXT, p_message_id BIGINT) IS 'Delete a message from a queue';
COMMENT ON FUNCTION platform.archive_queue(p_queue_name TEXT) IS 'Archive a queue';
COMMENT ON FUNCTION platform.drop_queue(p_queue_name TEXT) IS 'Drop a queue';
COMMENT ON FUNCTION platform.notify_event(p_channel TEXT, p_payload JSONB) IS 'Notify an event via pg_notify';
COMMENT ON FUNCTION platform.notify_structured_event(p_channel TEXT, p_event_type TEXT, p_entity_type TEXT, p_entity_id UUID, p_additional_data JSONB) IS 'Notify a structured event';
COMMENT ON FUNCTION platform.move_to_dlq(p_queue_name TEXT, p_message_id BIGINT, p_error_message TEXT) IS 'Move failed message to dead letter queue';
COMMENT ON FUNCTION platform.get_queue_stats(p_queue_name TEXT) IS 'Get queue statistics';
