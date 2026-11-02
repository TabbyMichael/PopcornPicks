-- Example queue for notifications domain
-- Replace with actual pgmq queue definitions

-- Create queue using pgmq
SELECT pgmq.create('notifications_example_queue');

-- Add comment
COMMENT ON QUEUE notifications_example_queue IS 'Message queue for notifications domain operations';

-- Example queue partition (for high-volume queues)
-- SELECT pgmq.create_partitioned('notifications_example_queue');
