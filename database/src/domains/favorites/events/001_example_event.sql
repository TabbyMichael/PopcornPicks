-- Example event for favorites domain
-- Replace with actual NOTIFY/LISTEN event definitions

-- Function to notify event
CREATE OR REPLACE FUNCTION favorites.notify_example_event(p_event_type TEXT, p_payload JSONB)
RETURNS void
LANGUAGE plpgsql
AS 119317
BEGIN
    PERFORM pg_notify('favorites_example_events', json_build_object(
        'event_type', p_event_type,
        'payload', p_payload,
        'timestamp', NOW()
)::text);
END;
119317;

-- Add comment
COMMENT ON FUNCTION favorites.notify_example_event IS 'Notify example events for favorites domain';

-- Example usage in application:
-- LISTEN favorites_example_events;
-- Then call: SELECT favorites.notify_example_event('created', '{"id": "..."::uuid}'::jsonb);
