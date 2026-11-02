-- Example event for users domain
-- Replace with actual NOTIFY/LISTEN event definitions

-- Function to notify event
CREATE OR REPLACE FUNCTION users.notify_example_event(p_event_type TEXT, p_payload JSONB)
RETURNS void
LANGUAGE plpgsql
AS 119317
BEGIN
    PERFORM pg_notify('users_example_events', json_build_object(
        'event_type', p_event_type,
        'payload', p_payload,
        'timestamp', NOW()
)::text);
END;
119317;

-- Add comment
COMMENT ON FUNCTION users.notify_example_event IS 'Notify example events for users domain';

-- Example usage in application:
-- LISTEN users_example_events;
-- Then call: SELECT users.notify_example_event('created', '{"id": "..."::uuid}'::jsonb);
