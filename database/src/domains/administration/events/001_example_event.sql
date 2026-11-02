-- Example event for administration domain
-- Replace with actual NOTIFY/LISTEN event definitions

-- Function to notify event
CREATE OR REPLACE FUNCTION administration.notify_example_event(p_event_type TEXT, p_payload JSONB)
RETURNS void
LANGUAGE plpgsql
AS 119317
BEGIN
    PERFORM pg_notify('administration_example_events', json_build_object(
        'event_type', p_event_type,
        'payload', p_payload,
        'timestamp', NOW()
)::text);
END;
119317;

-- Add comment
COMMENT ON FUNCTION administration.notify_example_event IS 'Notify example events for administration domain';

-- Example usage in application:
-- LISTEN administration_example_events;
-- Then call: SELECT administration.notify_example_event('created', '{"id": "..."::uuid}'::jsonb);
