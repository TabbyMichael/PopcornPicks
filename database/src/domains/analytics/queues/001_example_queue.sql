-- Example queue for analytics domain
-- Replace with actual pgmq queue definitions

-- Create queue using pgmq
SELECT pgmq.create('analytics_example_queue');

-- Add comment
COMMENT ON QUEUE analytics_example_queue IS 'Message queue for analytics domain operations';

-- Example queue partition (for high-volume queues)
-- SELECT pgmq.create_partitioned('analytics_example_queue');
