-- Example queue for system domain
-- Replace with actual pgmq queue definitions

-- Create queue using pgmq
SELECT pgmq.create('system_example_queue');

-- Add comment
COMMENT ON QUEUE system_example_queue IS 'Message queue for system domain operations';

-- Example queue partition (for high-volume queues)
-- SELECT pgmq.create_partitioned('system_example_queue');
